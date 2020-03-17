import roleList from '@/gameConfig/role';
import { message } from 'antd';
import enemyList from '@/gameConfig/enemy';

export default {
  namespace:'gameBeforeModel',
  state:{

  },
  effects:{
    *init({ payload },{ put,select }) {
      const { load=false,roleId } = payload;
      const { role } = select(_ => _.gameModel);
      if(!load && !role) {
        const role = Object.values(roleList).filter(role => role.id === roleId);
        if(role.length > 0) {
          yield put({ type:'updateRole',payload:role[0] })
        } else {
          message.error("通过角色id无法获取到角色");
        }
      }
    }
  },
  reducers:{
    updateRole(state,{ payload }) {
      return {
        ...state,
        role:payload
      }
    },
  }

}



