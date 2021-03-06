import React from 'react';
import QRCode from 'qrcode'

const Component = () => {
  const [code, setCode] = React.useState('')

  React.useEffect(() => {
    const adminUrl = `${window.location.href.replace(/\/$/, '')}/#/admin`
    QRCode.toDataURL(adminUrl, (err, url) => {
      setCode(url)
    })
  })

  return (
    <>
      <div style={{textAlign: "center"}}><img src={code} alt="" /><br />管理用画面</div>
    </>
  );
}

export default Component;
