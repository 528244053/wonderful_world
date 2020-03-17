import React from 'react';
import RoleList from '@/gameConfig/role';
import { Modal } from 'antd';
import SelectWindow from '@/components/SelectWinodw/SelctWindow';
import { getRoleInfoList } from '@/utils/getInfo';

const RoleSelect = ({ onSelect }) => {

  const handleSelect = role => {
     const modal = Modal.confirm({
       title:'选择确认',
       content:getRoleInfoList(role),
       okCancel: () => {
         modal.destroy();
       },
       onOk: () => {
         onSelect(role);
       }
     });
  };



  return(
    <div style={{display:'flex',alignItems:'center'}}>
      {Object.values(RoleList).map(role => (
        <SelectWindow
          key={role.id}
          height={600}
          imgName={role.name}
          imgUrl={role.imgUrl}
          desc={role.desc}
          handleSelect={() => handleSelect(role)}
        />
      ))}
    </div>
  )
};


export default RoleSelect;
