import { Memo } from './memo.js';
import * as ls from './localStorage.js';

$(() => {
    const memoListFromStorage = ls.getItem();

    /**
     * 로컬스토리지에 저장된 메모를 화면에 생성한다.
     */
    for (let memoid in memoListFromStorage) {
        createMemo(memoListFromStorage[memoid]);
    }
});

let maxIndex = 0;
    
const handleContextMenuClickEvent = (e) => {
    e.preventDefault();
    maxIndex++;
    createMemo({
        top: e.pageY, 
        left: e.pageX, 
        zIndex: maxIndex,
    });
}

const createMemo = (initialData) => {
    if (!initialData) return;
    const memo = new Memo(initialData);

    if (initialData.zIndex > maxIndex){
        maxIndex = initialData.zIndex;
    }
    ls.memoData[memo.id] = memo;

    createMemoDom(memo);
}

const handleRemoveMemoClickEvent = () => {
    event.stopImmediatePropagation();
    const targetDom = $(event.target).parent().parent();

    delete ls.memoData[targetDom[0].getAttribute("memoid")]
    targetDom.remove();
}

const setMemoContents = () => {
    $('.textarea').toArray().forEach((item, index) => {
        ls.memoData[item.getAttribute("memoid")].contents = item.value
    });
}

/*** 
 * handleClickEvent()
 * 클릭한 메모를 최상단으로 올린다.
*/
const handleClickEvent = () => {
    let targetDom = $(event.currentTarget)[0];
        
    maxIndex++;
    targetDom.style.zIndex = maxIndex;
    ls.memoData[targetDom.getAttribute("memoid")].move(null, null, maxIndex);
}

/**
 * handleMouseUpEvent()
 * 리사이즈된 메모의 크기를 저장한다.
 */

const handleMouseUpEvent = () => {
    var targetDom = $(event.currentTarget);
    ls.memoData[targetDom[0].getAttribute("memoid")].resize(
        targetDom.outerWidth(),
        targetDom.outerHeight()
    );
}

const createMemoDom = (memo) => {
    const dom = $(memo.createDom());
    $('.wrap').append(dom);

    dom.on('click', handleClickEvent.bind(this));
    dom.find('.btn_close').on("mousedown", handleRemoveMemoClickEvent.bind(this));
    dom.find('textarea').on("mouseup", handleMouseUpEvent.bind(this));
    
    /**
     * mousedown 이벤트를 dratstart로 동작하도록 처리한다.
     */
    dom.find('.header').on("mousedown", function(event) {
        let targetDom = $(event.target).parent()[0];
        targetDom.style.opacity = "0.4";
    
        const offsetX = - event.offsetX;
        const offsetY = - event.offsetY;
        let dragStart = false;

        maxIndex++;
        targetDom.style.zIndex = maxIndex;
    
        /**
         * mousedown 상태에서 mousemove 이벤트가 들어오면 드래그로 동작하도록 처리한다.
         * 마우스 위치를 따라다니며 메모 dom의 위치를 변경시킨다.
         */
        const dragFunction = function(event) {
            dragStart = true;
            const top = event.clientY;
            const left = event.clientX;
        
            moveMemo(targetDom, top + offsetY, left + offsetX);
        }
        document.addEventListener("mousemove", dragFunction);

        /**
         * mouseup 이벤트에서 drag를 종료시킨다.
         * 투명도를 1로 바꾸고, 최종 위치로 데이터를 업데이트한다.
         */
        const dragendFunction = function(event) {
            document.removeEventListener("mousemove", dragFunction);
            document.removeEventListener("mouseup", dragendFunction);
            targetDom.style.opacity = 1;
            if (!dragStart) return;
    
            const top = event.clientY;
            const left = event.clientX;
    
            ls.memoData[targetDom.getAttribute("memoid")].move(top + offsetY, left + offsetX, maxIndex);
        }
        document.addEventListener("mouseup", dragendFunction)
    });
    
}
const moveMemo = (dom, top, left) => {
    dom.style.top = `${top}px`;
    dom.style.left = `${left}px`;
}

const handleBeforeunload = () => {
    setMemoContents()
    ls.setItem();
}

const closeInfo = () => {
    const targetDom = $(event)[0].target;
    $(targetDom).parent().addClass('close');
    $(targetDom).remove();
}

$(document).on("contextmenu", handleContextMenuClickEvent.bind(this));
$(window).on("beforeunload", handleBeforeunload.bind(this));

$('.infoCloseButton').on('click', closeInfo.bind(this));