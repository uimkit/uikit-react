# @uimkit/uikit-react


## 简介
聊天系统 uikit 的封装. SDK 可任意适配第三方聊天SDK.



### UIKit 可集成的平台及相关适配工程
<table>
  <tr>
    <th width="180px" style="text-align:center">平台</th>
    <th width="500px" style="text-align:center">SDK适配器项目</th>
  </tr>
  <tr>
    <td style="text-align:center">UIM官方SDK适配器</td>
    <td style="text-align:center"><a href="">@uimkit/uikit-uim-adaptor</a></td>
  </tr>
  <tr>
    <td style="text-align:center">腾讯云TIM</td>
    <td style="text-align:center"><a href="#">@uimkit/uikit-tim-adaptor</a></td>
  </tr>
  <tr>
    <td style="text-align:center">云信NIM</td>
    <td style="text-align:center"><a href="#">@uimkit/uikit-nim-adaptor</a></td>
  </tr>
  <tr>
    <td style="text-align:center">融云</td>
    <td style="text-align:center"><a href="#">@uimkit/uikit-rongyun-adaptor</a></td>
  </tr>
</table>



## 示例
集成 UIMSDK

```tsx
import UIMClientAdaptor from '@uimkit/uikit-uim-adaptor';
import UIKit from '@uimkit/uikit-react';

export function App() {
  const accessToken = `Your accessToken`;

  const client = new UIMClientAdaptor(accessToken);
  
  return (
    <UIKit client={client}>
    </UIKit>
  );
}
```




## 运行示例
```
$ git clone https://github.com/uimkit/uikit-react
# 进入工程
$ cd uikit-react
# 安装依赖
$ pnpm i && cd examples/sample-chat && pnpm i
# 运行程序
$ pnpm dev
```
