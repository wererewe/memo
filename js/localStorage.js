export let memoData = {}

export const getItem = () => {
    return JSON.parse(localStorage.getItem('memoData'));
}

export const setItem = () => {
    localStorage.setItem('memoData', JSON.stringify(memoData))
}
