import React from 'react';
import { Button, Popover } from 'antd';

const SelectOption = ( { handleSelect,children,selectText = "选择",handleDetail }) => {
  return (
    <div style={{height:"100%",margin:5,border:'solid 2px',boxSizing:'content-box'}}>
      <div style={{padding:2,height:"80%"}}>
        {children}
      </div>
      <div className={'flexRow'} style={{ height:"20%", justifyContent:'space-around'}}>
        <Button onClick={handleSelect} style={{ width:'40%' }}>
          {selectText}
        </Button>
        {handleDetail && (
          <Button onClick={handleDetail}>
            详情
          </Button>
        )}
      </div>
    </div>
  )
};

export default SelectOption;
