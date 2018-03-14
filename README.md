# react-native-richeditor

本插件借鉴了react-native-webview-richeditor的开源库。

react-native-richeditor可以实现文字与图形的混排，以及字体的加粗。
![image](https://github.com/wwlxz22/react-native-richeditor/blob/master/Screenshot_2018-03-12-19-02-49-680_com.pets.png)

## 安装

这版编辑器包含插入图片功能，所以需要事先安装react-native-image-picker

```
npm install react-native-image-picker --save
react-native link
```
之后就可以安装编辑器了
如果使用yarn的用户可以使用

```
yarn add react-native-image-picker
```

图标运用的是开源图标，需要进行添加

```
yarn add react-native-vector-icons
```

然后添加本库
在package.json中添加
```
"dependencies": {
		"prop-types": "^15.6.0",
		"react": "16.0.0",
		"react-native": "0.54.1",
		"react-native-image-picker": "^0.26.7",
		"react-native-keyboard-spacer": "^0.4.1",
		"react-native-vector-icons": "^4.4.2",
		"react-native-webview-richeditor": "https://github.com/wwlxz22/react-native-richeditor.git",
		"react-navigation": "^1.5.1"
	},
```
一些用户会遇到类似于键盘遮挡等问题，可以安装react-native-keyboard-spacer
安卓最好在AndroidManifest.xml中添加如下配置来屏蔽原生键盘压缩布局的问题

```
...
<activity
android:windowSoftInputMode="stateHidden|adjustPan"
...
```

另外image-picker需要配置一些权限
```
<uses-permission android:name="android.permission.CAMERA" />
<uses-permission android:name="android.permission.READ_PHONE_STATE" />
<uses-permission android:name="android.permission.WRITE_EXTERNAL_STORAGE" />
<uses-permission android:name="android.permission.READ_EXTERNAL_STORAGE" />
<uses-permission android:name="android.permission.ACCESS_NETWORK_STATE" />
```

## 使用

```
import RichEditor from 'react-native-webview-richeditor';
...
<RichEditor />
```

如何获取当前文本的信息
```
import RichEditor from 'react-native-webview-richeditor';

let formData = new FormData();
        formData.append('content', this.editor.state.editorHtml);
...
 <RichEditor ref={(ref) => this.editor = ref}/>
```
 







