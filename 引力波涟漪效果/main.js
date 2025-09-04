(() => {
  const canvas = document.getElementById('gw-canvas');
  /** @type {WebGL2RenderingContext} */
  const gl = canvas.getContext('webgl2', { antialias: false, depth: false, stencil: false, powerPreference: 'high-performance', preserveDrawingBuffer: false });
  if (!gl) {
    alert('本示例需要支持 WebGL2 的浏览器');
    return;
  }

  // DPR & resize
  const state = {
    dpr: Math.min(window.devicePixelRatio || 1, 2),
    width: 0,
    height: 0,
    timeStart: performance.now(),
    mouse: { x: 0.5, y: 0.5, down: false },
    sources: [], // recent ripple sources: {x,y,time}
    maxSources: 8
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

  // Shaders
  const vertSrc = `#version 300 es
  precision highp float;
  layout(location=0) in vec2 position;
  out vec2 vUv;
  void main(){
    vUv = position * 0.5 + 0.5;
    gl_Position = vec4(position, 0.0, 1.0);
  }`;

  // Interference-like gravitational wave ripples using distance-based phase
  const fragSrc = `#version 300 es
  precision highp float;
  out vec4 outColor;
  in vec2 vUv;

  uniform float uTime;            // seconds
  uniform vec2  uResolution;      // pixels
  uniform int   uSourceCount;     // active sources
  uniform vec3  uSources[16];     // x, y in NDC [0,1], t0
  uniform float uAspect;          // width/height

  // Parameters controlling wave appearance
  const float waveSpeed = 0.4;     // propagation speed (units per second)
  const float baseFreq = 26.0;     // base angular frequency multiplier
  const float damping = 1.25;      // exponential damping with distance
  const float ringWidth = 0.9;     // affects sharpness of ring fronts

  // Tone mapping and palette
  vec3 palette(float t){
    // Subtle blue-cyan-magenta tone
    vec3 a = vec3(0.25, 0.30, 0.45);
    vec3 b = vec3(0.60, 0.50, 0.65);
    vec3 c = vec3(1.00, 1.10, 1.30);
    vec3 d = vec3(0.10, 0.23, 0.20);
    return a + b*cos(6.28318*(c*t + d));
  }

  void main(){
    vec2 uv = vUv;
    // Correct for aspect so waves look circular
    vec2 p = (uv - 0.5);
    p.x *= uAspect;

    float amp = 0.0;
    // Superpose multiple circular wavefronts
    for(int i=0;i<16;i++){
      if(i>=uSourceCount) break;
      vec2 s = uSources[i].xy - vec2(0.5);
      s.x *= uAspect;
      float t0 = uSources[i].z;
      float t = max(uTime - t0, 0.0);
      float r = length(p - s);
      float phase = r - t * waveSpeed;
      float env = exp(-r * damping) * smoothstep(0.0, ringWidth, t);
      float w = sin(phase * baseFreq);
      amp += w * env;
    }

    // Base field slow drift to avoid total silence
    amp += 0.075 * sin((p.x*1.4 + p.y*1.1) * 10.0 + uTime*0.6);

    // Map amplitude to color
    float m = 0.5 + 0.5 * tanh(amp);
    vec3 col = palette(m);
    // Add glow
    float glow = pow(abs(amp), 1.6);
    col += glow * 0.12;

    // Vignette
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

  // Fullscreen triangle (two-triangle quad using strip)
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

  // Uniform locations
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

  // Mouse interactions
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
    addSource(p.x, p.y);
  });
  canvas.addEventListener('pointermove', (e) => {
    const p = pointerPos(e);
    state.mouse.x = p.x; state.mouse.y = p.y;
    if (state.mouse.down) addSource(p.x, p.y);
  });
  window.addEventListener('pointerup', () => { state.mouse.down = false; });
  window.addEventListener('keydown', (e) => {
    if (e.key === 'r' || e.key === 'R') state.sources = [];
  });

  // Animation loop
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



