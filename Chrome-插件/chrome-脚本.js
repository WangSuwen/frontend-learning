// ==UserScript==
// @name         TODO: 这个名字到时候再确定
// @namespace    http://suwenya.net/
// @version      2024-07-14
// @description  基于油猴插件的 导出商品ID，并上传到自己直播间的chrome插件
// @author       You
// TODO: 这里要换成甲方网站域名
// @match        https://www.google.com*
// TODO: 这里要换成甲方网站域名
// @include      *://www.google.com*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// ==/UserScript==

// TODO: 基于油猴插件的Chrome 脚本


(function() {
    'use strict';
    const classsssss = `
        .d-g-b-c {
            position: fixed;
            top: 50vh;
            right: 10px;
            user-select: none;
            z-index: 999999;
            background: white;
            padding: 30px;
            padding-left: 50px;
            border-radius: 5px;
            box-shadow: rgba(0, 0, 0, 0.5) 0px 0px 10px;
            cursor: move;
        }
        .d-g-bt {
            cursor: pointer;
            padding: 5px 10px;
            border-radius: 3px;
            background: rgb(0, 123, 255);
            color: white;
            font-size: 14px;
        }
    `;

    const script = document.createElement('script');
    script.src = 'https://unpkg.com/xlsx/dist/xlsx.full.min.js';
    document.head.appendChild(script);


    
    function init () {
        const style = document.createElement('style');
        style.innerHTML = classsssss;
        document.head.appendChild(style);

        const btnContainer = document.createElement('div');
        btnContainer.classList.add('d-g-b-c');
        dragElement(btnContainer);

        const exportBtn = document.createElement('div');
        exportBtn.innerText = '导出商品ID';
        exportBtn.classList.add('d-g-bt');
        exportBtn.onclick = function () {
            downloadExcel();
        }

        const importBtn = document.createElement('div');
        importBtn.innerText = '导入商品ID';
        importBtn.classList.add('d-g-bt');
        importBtn.style.marginTop = '20px';
        importBtn.style.backgroundColor = '#67c23a';
        importBtn.onclick = function () {
            // downloadExcel();
        }


        btnContainer.appendChild(exportBtn);
        btnContainer.appendChild(importBtn);
        document.body.appendChild(btnContainer);
    }
    init();

    function dragElement(elmnt) {
        let isDragging = false;
        let offsetX, offsetY;

        elmnt.addEventListener('mousedown', (e) => {
            isDragging = true;
            offsetX = e.clientX - elmnt.getBoundingClientRect().left;
            offsetY = e.clientY - elmnt.getBoundingClientRect().top;
            document.addEventListener('mousemove', onMouseMove);
            document.addEventListener('mouseup', onMouseUp);
        });
        
        function onMouseMove(e) {
            if (!isDragging) return;
            elmnt.style.right = 'unset';
            elmnt.style.left = e.clientX - offsetX + 'px';
            elmnt.style.top = e.clientY - offsetY + 'px';
        }
        
        function onMouseUp() {
            isDragging = false;
            document.removeEventListener('mousemove', onMouseMove);
            document.removeEventListener('mouseup', onMouseUp);
        }
    }

    function getGoods () {
        // TODO: 这里要换成甲方网站获取商品ID的代码
    }

    function downloadExcel(data, filename) {
        const xlsxData = [
            { 商品ID: 1 },
            { 商品ID: 2 },
            { 商品ID: 3 },
            { 商品ID: 4 },
            { 商品ID: 5 },
            { 商品ID: 6 },
            { 商品ID: 7 },
            { 商品ID: 8 },
            { 商品ID: 9 },
            { 商品ID: 10 },
            { 商品ID: 11 },
            { 商品ID: 12 },
            { 商品ID: 13 },
            { 商品ID: 14 },
            { 商品ID: 15 },
        ]
        const worksheet = XLSX.utils.json_to_sheet(xlsxData);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
        // 生成二进制字符串
        const wbout = XLSX.write(workbook, { bookType: 'xlsx', type: 'binary' });

        // 将字符串转化为Buffer
        function s2ab(s) {
            const buf = new ArrayBuffer(s.length);
            const view = new Uint8Array(buf);
            for (let i = 0; i < s.length; i++) {
                view[i] = s.charCodeAt(i) & 0xFF;
            }
            return buf;
        }

        // 触发下载
        const blob = new Blob([s2ab(wbout)], { type: "application/octet-stream" });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = '商品ID列表.xlsx';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }

    function uploadExcel () {
        // TODO: 这里要换成甲方网站上传Excel的代码
    }

    setTimeout(() => {
        console.log('开始生成Excel......');
        // downloadExcel();
    }, 2000);
    
})();