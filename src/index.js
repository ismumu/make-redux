
// 纯函数（Pure Function）
// reducer 是不允许有副作用的。你不能在里面操作 DOM，也不能发 Ajax 请求，更不能直接修改 state，它要做的仅仅是 —— 初始化和计算新的 state。
function createStore (reducer) {

    let state = null;

    const listeners = [];
    const subscribe = (listener) => {
        listeners.push(listener);
    }

    const getState = () => state;
    const dispatch = (action) => {

        state = reducer(state, action);

        listeners.forEach((listener) => listener())
    }
    dispatch({}); // 初始化state

    return { getState, dispatch, subscribe }
}



function renderApp (newAppState, oldAppState = {}) {
    if (newAppState === oldAppState) return // 数据没有变化不进行渲染
    console.log('render app...')
    renderTitle(newAppState.title, oldAppState.title);
    renderContent(newAppState.content, oldAppState.content);
}

function renderTitle (newTitle, oldTitle = {}) {
    if (newTitle === oldTitle) return
    console.log('render title...')
    const titleDom = document.getElementById('title');
    titleDom.innerHTML = newTitle.text;
    titleDom.style.color = newTitle.color;
}

function renderContent (newContent, oldContent = {}) {
    if (newContent === oldContent) return
    console.log('render content...')
    const contentDom = document.getElementById('content');
    contentDom.innerHTML = newContent.text;
    contentDom.style.color = newContent.color;
}


function stateChanger (state, action) {

    if ( !state ) {
        return {
            title: {
                text: 'title',
                color: 'red'
            },
            content: {
                text: 'content',
                color: 'blue'
            }
        }
    }


    switch (action.type) {
        case 'UPDATE_TITLE_TEXT' :
            return {
                ...state,
                title: {
                    ...state.title,
                    text: action.text,
                }
            }
        case 'UPDATE_TITLE_COLOR' :
            return {
                ...state,
                title: {
                    ...state.title,
                    color: action.color
                }
            }
        default :
            return state;
    }
}


const store = createStore(stateChanger);
let oldState = store.getState();

// 监听数据变化
store.subscribe(() => {
    const newState = store.getState();
    renderApp(newState, oldState);
    oldState = newState;
})


renderApp(store.getState()); // 首次渲染

store.dispatch({ type: 'UPDATE_TITLE_TEXT', text: 'new title' }) // 修改标题文本
store.dispatch({ type: 'UPDATE_TITLE_COLOR', color: 'blue' }) // 修改标题颜色

