const DEFAULT_WIDTH_SIZE = 200;
const DEFAULT_HEIGHT_SIZE = 200;

export class Memo {
    initialze = (initialData) => {
        if (!initialData) return;
        this.id = initialData.id || Math.random().toString(36).substr(2, 4);
        this.width = initialData.width || DEFAULT_WIDTH_SIZE;
        this.height = initialData.height || DEFAULT_HEIGHT_SIZE;
        this.contents = initialData.contents || '';
        this.top = initialData.top;
        this.left = initialData.left;
        this.zIndex = initialData.zIndex;
    };
    move = (top, left, zIndex) => {
        if (top) this.top = top;
        if (left) this.left = left;
        this.zIndex = zIndex;
    };
    resize = (width, height) => {
        this.width = width;
        this.height = height;
    };

    createDom = () => {
        return `
            <li memoid="${this.id}" class="memo" style="top:${this.top}px;left:${this.left}px;z-index:${this.zIndex};">
                <div class="header">
                    <h1 class="blind">메모장</h1>
                    <button class="btn_close"><span class="blind">닫기</span></button>
                </div>
                <div class="content">
                    <textarea memoid="${this.id}" class="textarea" contenteditable="true" style="width:${this.width}px; height:${this.height}px;">${this.contents}</textarea>
                </div>
            </li>
        `;
    };
}

