import React from 'react';
import { Button, Popover } from 'antd';

const SelectOption = ( { handleSelect,children }) => {
  return (
    <div style={{height:"100%",margin:5,border:'solid 2px',boxSizing:'content-box'}}>
      <div style={{padding:2,height:"80%"}}>
        {children}
      </div>
      <div style={{padding:2,height:"20%",display:'flex',flexDirection:'column',alignContent:'center'}}>
        <Button onClick={handleSelect}>
          选择
        </Button>
      </div>
    </div>
  )
};

export default SelectOption;
