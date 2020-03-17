
import { routerRedux } from 'dva';
import { message } from 'antd';


export default {
  namespace:'fightModel',
  state:{

  },
  subscriptions:{
    setup({ dispatch, history }) {
      return history.listen(params => {
        const { pathname } = params;
        if (pathname !== '/FightInterface') {
          dispatch({ type: 'destroy' });
        }
      });
    },
  },
  effects:{
    *init({ payload,callback },{ put,select }) {
      const gameModel = yield select(_ => _.gameModel);
      const { role,enemy } = gameModel;
      if(!role || !enemy) {
        message.error("无法获取到角色以及敌人信息");
        yield put(routerRedux.goBack());
      } else {
        yield put({
          type:'updateState',
          payload: {
            role,
            enemy,
          }
        });
        if(callback) callback(role,enemy);
      }
    }
  },
  reducers:{
    updateState(state,{ payload }) {
      return {
        ...state,
        ...payload
      }
    },
    updateRole(state,{ payload }) {
      return {
        ...state,
        role:payload
      }
    },
    destroy() {
      return {  }
    }
  }

}



