(() => {
  const canvas = document.getElementById('gw-canvas');
  /** @type {WebGL2RenderingContext} WebGL2 上下文 */
  const gl = canvas.getContext('webgl2', { antialias: false, depth: false, stencil: false, powerPreference: 'high-performance', preserveDrawingBuffer: false });
  if (!gl) {
    alert('本示例需要支持 WebGL2 的浏览器');
    return;
  }

  // DPR 与尺寸变更
  const state = {
    dpr: Math.min(window.devicePixelRatio || 1, 2),
    width: 0,
    height: 0,
    timeStart: performance.now(),
    mouse: { x: 0.5, y: 0.5, down: false },
    sources: [], // 最近的涟漪源: {x,y,time}
    maxSources: 8,
    sourceIntervalMs: 180, // 新涟漪源的最小生成间隔（毫秒）
    lastSourceMs: 0
  };

  function resize() {
    state.dpr = Math.min(window.devicePixelRatio || 1, 2);
    const { innerWidth, innerHeight } = window;
    const displayWidth = Math.floor(innerWidth * state.dpr);
    const displayHeight = Math.floor(innerHeight * state.dpr);
    if (canvas.width !== displayWidth || canvas.height !== displayHeight) {
      canvas.width = displayWidth;
      canvas.height = displayHeight;
    }
    state.width = displayWidth;
    state.height = displayHeight;
    gl.viewport(0, 0, state.width, state.height);
  }

  window.addEventListener('resize', resize, { passive: true });
  resize();

  // 着色器
  const vertSrc = `#version 300 es
  precision highp float;
  layout(location=0) in vec2 position;
  out vec2 vUv;
  void main(){
    vUv = position * 0.5 + 0.5;
    gl_Position = vec4(position, 0.0, 1.0);
  }`;

  // 基于距离相位的干涉型引力波涟漪
  const fragSrc = `#version 300 es
  precision highp float;
  out vec4 outColor;
  in vec2 vUv;

  uniform float uTime;            // 秒
  uniform vec2  uResolution;      // 像素分辨率
  uniform int   uSourceCount;     // 活跃源数量
  uniform vec3  uSources[16];     // NDC 中的 x,y [0,1]，以及产生时间 t0
  uniform float uAspect;          // 宽高比

  // 控制波形外观的参数
  const float waveSpeed = 0.12;    // 传播速度（单位/秒）
  const float baseFreqNear = 34.0; // 近处角频率倍增（波长更短）
  const float baseFreqFar  = 14.0; // 远处角频率倍增（波长更长）
  const float freqRadius   = 0.85; // 频率从近到远的过渡半径范围
  const float damping = 1.25;      // 随距离的指数衰减
  const float ringWidth = 0.9;     // 环形波前的锐利程度
  const float pulseWidth = 8.0;    // 单脉冲包络宽度（越大越窄，越像单个环）

  // 余弦调色板（较为柔和的蓝-青-洋红）
  vec3 palette(float t){
    vec3 a = vec3(0.25, 0.30, 0.45);
    vec3 b = vec3(0.60, 0.50, 0.65);
    vec3 c = vec3(1.00, 1.10, 1.30);
    vec3 d = vec3(0.10, 0.23, 0.20);
    return a + b * cos(6.28318 * (c * t + d));
  }

  void main(){
    vec2 uv = vUv;
    // 按宽高比纠正，保证波纹为圆形
    vec2 p = (uv - 0.5);
    p.x *= uAspect;

    float amp = 0.0;
    // 叠加多个圆形波前
    for(int i=0;i<16;i++){
      if(i>=uSourceCount) break;
      vec2 s = uSources[i].xy - vec2(0.5);
      s.x *= uAspect;
      float t0 = uSources[i].z;
      float t = max(uTime - t0, 0.0);
      float r = length(p - s);
      float phase = r - t * waveSpeed;
      float env = exp(-r * damping) * smoothstep(0.0, ringWidth, t);
      // 根据与波源的距离 r 让频率由近到远逐渐降低，实现“近处短波长，远处长波长”
      float k = mix(baseFreqNear, baseFreqFar, smoothstep(0.0, freqRadius, r));
      // 使用以相位为中心的高斯包络，形成单个传播的环（避免连续新波叠加）
      float pulse = exp(-pow(phase * pulseWidth, 2.0));
      float w = sin(phase * k) * pulse;
      amp += w * env;
    }

    // 基础场的缓慢漂移，避免画面过于静止
    amp += 0.075 * sin((p.x*1.4 + p.y*1.1) * 10.0 + uTime*0.6);

    // 振幅映射到颜色（余弦调色板）
    float m = 0.5 + 0.5 * tanh(amp);
    vec3 col = palette(m);
    // 添加微弱辉光
    float glow = pow(abs(amp), 1.6);
    col += glow * 0.12;

    // 暗角
    float v = smoothstep(0.95, 0.3, length(uv - 0.5));
    col *= v;
    outColor = vec4(col, 1.0);
  }`;

  function createShader(gl, type, src) {
    const sh = gl.createShader(type);
    gl.shaderSource(sh, src);
    gl.compileShader(sh);
    if (!gl.getShaderParameter(sh, gl.COMPILE_STATUS)) {
      const info = gl.getShaderInfoLog(sh);
      gl.deleteShader(sh);
      throw new Error('Shader compile failed: ' + info);
    }
    return sh;
  }

  function createProgram(gl, vs, fs) {
    const prog = gl.createProgram();
    gl.attachShader(prog, vs);
    gl.attachShader(prog, fs);
    gl.linkProgram(prog);
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) {
      const info = gl.getProgramInfoLog(prog);
      gl.deleteProgram(prog);
      throw new Error('Program link failed: ' + info);
    }
    return prog;
  }

  const vs = createShader(gl, gl.VERTEX_SHADER, vertSrc);
  const fs = createShader(gl, gl.FRAGMENT_SHADER, fragSrc);
  const program = createProgram(gl, vs, fs);
  gl.useProgram(program);

  // 全屏矩形（三角带）
  const quad = new Float32Array([
    -1, -1,
     1, -1,
    -1,  1,
     1,  1,
  ]);
  const vao = gl.createVertexArray();
  gl.bindVertexArray(vao);
  const vbo = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, vbo);
  gl.bufferData(gl.ARRAY_BUFFER, quad, gl.STATIC_DRAW);
  gl.enableVertexAttribArray(0);
  gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);

  // Uniform 变量位置
  const uTimeLoc = gl.getUniformLocation(program, 'uTime');
  const uResolutionLoc = gl.getUniformLocation(program, 'uResolution');
  const uSourceCountLoc = gl.getUniformLocation(program, 'uSourceCount');
  const uSourcesLoc = gl.getUniformLocation(program, 'uSources');
  const uAspectLoc = gl.getUniformLocation(program, 'uAspect');

  function addSource(nx, ny) {
    const now = (performance.now() - state.timeStart) / 1000;
    state.sources.push({ x: nx, y: ny, time: now });
    while (state.sources.length > state.maxSources) state.sources.shift();
  }

  // 带节流的添加：按下立即生成一次，之后按最小间隔生成
  function tryAddSource(nx, ny, force) {
    const nowAbs = performance.now();
    if (force || nowAbs - state.lastSourceMs >= state.sourceIntervalMs) {
      addSource(nx, ny);
      state.lastSourceMs = nowAbs;
    }
  }

  // 鼠标交互
  function pointerPos(e) {
    const rect = canvas.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = 1.0 - (e.clientY - rect.top) / rect.height;
    return { x, y };
  }

  canvas.addEventListener('pointerdown', (e) => {
    state.mouse.down = true;
    const p = pointerPos(e);
    state.mouse.x = p.x; state.mouse.y = p.y;
    tryAddSource(p.x, p.y, true);
  });
  canvas.addEventListener('pointermove', (e) => {
    const p = pointerPos(e);
    state.mouse.x = p.x; state.mouse.y = p.y;
    if (state.mouse.down) tryAddSource(p.x, p.y, false);
  });
  window.addEventListener('pointerup', () => { state.mouse.down = false; });
  window.addEventListener('keydown', (e) => {
    if (e.key === 'r' || e.key === 'R') state.sources = [];
  });

  // 动画循环
  function render() {
    const now = (performance.now() - state.timeStart) / 1000;
    gl.useProgram(program);
    gl.bindVertexArray(vao);
    gl.viewport(0, 0, state.width, state.height);
    gl.uniform1f(uTimeLoc, now);
    gl.uniform2f(uResolutionLoc, state.width, state.height);
    gl.uniform1f(uAspectLoc, state.width / Math.max(1, state.height));
    const count = Math.min(state.sources.length, 16);
    gl.uniform1i(uSourceCountLoc, count);
    const arr = new Float32Array(16 * 3);
    for (let i = 0; i < count; i++) {
      arr[i * 3 + 0] = state.sources[i].x;
      arr[i * 3 + 1] = state.sources[i].y;
      arr[i * 3 + 2] = state.sources[i].time;
    }
    gl.uniform3fv(uSourcesLoc, arr);
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    requestAnimationFrame(render);
  }
  requestAnimationFrame(render);
})();



