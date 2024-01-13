export const useClipboard = (textToCopy) => {



  // 获取剪贴板访问权限
  navigator.permissions.query({ name: 'clipboard-write' }).then(permissionStatus => {
    if (permissionStatus.state === 'granted' || permissionStatus.state === 'prompt') {
      // 读取剪贴板内容
      navigator.clipboard.readText().then(clipboardText => {
        console.log('剪贴板内容:', clipboardText);
      });

      // 复制文本到剪贴板

      navigator.clipboard.writeText(textToCopy).then(() => {
        console.log('文本已成功复制到剪贴板');
      }).catch(err => {
        console.error('复制文本到剪贴板失败:', err);
      });
    } else {
      console.error('无法获取剪贴板访问权限');
    }
  }).catch(err => {
    console.error('查询剪贴板权限状态失败:', err);
  });
}

