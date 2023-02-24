# @uimkit/uikit-react

<img style="width:64px" src="https://mgmt.uimkit.chat/media/img/avatar.png"/>

## 简介
聊天系统 uikit 的封装. SDK 可任意适配第三方聊天SDK.
高度可扩展性, 方便快速集成和定制.


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


## 什么是UIM
UIM 是一个全渠道聊天即服务的云平台, 聚合了全球主流聊天系统. 可以通过统一的API接口进行多渠道服务调用.
平台保持云中立, 技术方案不依赖于任何一个服务提供方，便于开发者跨服务提供商进行快速迁移

以下是不完全集成列表
### 即时通信
<table>
  <tr>
    <th width="180px" style="text-align:center">提供商</th>
    <th width="500px" style="text-align:center">策略</th>
  </tr>
  <tr>
    <td style="text-align:center">微信</td>
    <td style="text-align:center">iPad</td>
  </tr>
  <tr>
    <td style="text-align:center">微信</td>
    <td style="text-align:center">Windows</td>
  </tr>
  <tr>
    <td style="text-align:center">微信</td>
    <td style="text-align:center">Android</td>
  </tr>
  <tr>
    <td style="text-align:center">企业微信</td>
    <td style="text-align:center">Windows</td>
  </tr>
  <tr>
    <td style="text-align:center">企业微信客服</td>
    <td style="text-align:center">OpenAPI</td>
  </tr>
  <tr>
    <td style="text-align:center">小程序客服</td>
    <td style="text-align:center">OpenAPI</td>
  </tr>
  <tr>
    <td style="text-align:center">公众号客服</td>
    <td style="text-align:center">OpenAPI</td>
  </tr>
  <tr>
    <td style="text-align:center">Facebook Messenger</td>
    <td style="text-align:center">OpenAPI</td>
  </tr>
  <tr>
    <td style="text-align:center">WhatsApp</td>
    <td style="text-align:center">Web</td>
  </tr>
  <tr>
    <td style="text-align:center">WhatsApp</td>
    <td style="text-align:center">OpenAPI</td>
  </tr>
  <tr>
    <td style="text-align:center">Telegram</td>
    <td style="text-align:center">OpenAPI</td>
  </tr>
  <tr>
    <td style="text-align:center">Lark</td>
    <td style="text-align:center">API</td>
  </tr>
</table>


### 即时通信云SDK
<table>
  <tr>
    <th width="180px" style="text-align:center">提供商</th>
  </tr>
  <tr>
    <td style="text-align:center">腾讯云TIM</td>
  </tr>
  <tr>
    <td style="text-align:center">网易云NIM</td>
  </tr>
  <tr>
    <td style="text-align:center">融云</td>
  </tr>
</table>

### 在线客服
<table>
  <tr>
    <th width="180px" style="text-align:center">提供商</th>
  </tr>
  <tr>
    <td style="text-align:center">网易七鱼</td>
  </tr>
  <tr>
    <td style="text-align:center">美洽</td>
  </tr>
  <tr>
    <td style="text-align:center">InterCom</td>
  </tr>
</table>