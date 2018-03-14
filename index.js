/**
 * @flow
 */

import React, {Component} from 'react';
import {
    TouchableOpacity,
    AppRegistry,
    ScrollView,
    StyleSheet,
    Platform,
    WebView,
    Text,
    View
} from 'react-native';

import ImagePicker from 'react-native-image-picker';
import Icon from 'react-native-vector-icons/Feather';


const ICON_IMAGEFILE = 'image';
const ICON_BOLD = 'bold';

export default class WebViewRichEditor extends Component {
    constructor(props) {
        super(props);
        this.state = {
            editorStates: [],
            showToolBar: true,
            editorHtml: ''
        }

        this.onMessage = this.onMessage.bind(this);
        this.postMessage = this.postMessage.bind(this);
        this.initCommands = this.initCommands.bind(this);

        this.initCommands();
    }

    initCommands() {
        this.commands = [];
        Platform.select({
            ios: () => {
                this.commands.push({
                    name: 'INSERTLOCALIMAGE', glyph: ICON_IMAGEFILE, command: JSON.stringify({
                        command: 'insertLocalImage'
                    })
                });
            },
            android: () => {
                if (Platform.Version >= 19) {
                    this.commands.push({
                        name: 'INSERTLOCALIMAGE', glyph: ICON_IMAGEFILE, command: JSON.stringify({
                            command: 'insertLocalImage'
                        })
                    });
                }
            }
        })();
        Platform.select({
            ios: () => {
                this.commands.push({
                    name: 'BOLD', glyph: ICON_BOLD, command: JSON.stringify({
                        command: "bold"
                    })
                });
            },
            android: () => {
                if (Platform.Version >= 19) {
                    this.commands.push({
                        name: 'BOLD', glyph: ICON_BOLD, command: JSON.stringify({
                            command: "bold"
                        })
                    });
                }
            }
        })();
    }

    componentDidMount() {
        this.initIntervalID = setInterval(() => {
            this.postMessage('init');
        }, 500)
    }

    onMessage(e) {
        let message = e.nativeEvent.data;
        console.log(message);

        if (message == 'loaded' && this.initIntervalID) {
            clearInterval(this.initIntervalID);
            this.initIntervalID = undefined;
            return
        }

        var command = null;
        try {
            command = JSON.parse(message);
        }
        catch (error) {
            return;
        }

        switch (command.command) {
            case 'STATES':
                console.log(command.states);
                this.setState({editorStates: command.states});
                break;
            case 'HTML':
                this.setState({editorHtml: command.html});
                break;
        }
    }

    postMessage(str) {
        if (this.webview) {
            this.webview.postMessage(str);
        }
    }

    renderButton() {
        if (this.commands && this.commands.length > 0) {
            return this.commands.map((item, index) => {
                let isChecked = this.state.editorStates.indexOf(item.name) != -1 ? true : false;
                let fontColor = isChecked ? {color: '#5fa137'} : {color: 'black'}

                return (<TouchableOpacity
                    key={index}
                    style={styles.button}
                    onPress={() => {
                        switch (item.name) {
                            case 'INSERTLOCALIMAGE':
                                const options = {
                                    title: "选择图片",
                                    cancelButtonTitle: "取消",
                                    takePhotoButtonTitle: "从相机选择",
                                    chooseFromLibraryButtonTitle: "从相册选择",
                                    storageOptions: {
                                        skipBackup: true,
                                        path: 'images'
                                    },
                                    maxWidth: 800,
                                    maxHeight: 600.
                                };
                                ImagePicker.showImagePicker(options, (response) => {
                                    if (response.didCancel) {
                                    } else if (response.error) {
                                    } else if (response.customButton) {
                                    } else {
                                        let timestamp = new Date().getTime().toString();
                                        //alert(response.width);
                                        let base64 = 'data:image/png;base64,' + response.data;
                                        this.postMessage(
                                            JSON.stringify({
                                                command: 'insertLocalImage',
                                                id: timestamp,
                                                source: base64
                                            })
                                        );
                                    }
                                });

                                break;
                            case 'BLOCKQUOTE':
                                for (let state of this.state.editorStates) {
                                    if (state == item.name) {
                                        this.postMessage(JSON.stringify({
                                            command: "removeFormat"
                                        }));
                                        return;
                                    }
                                }
                                this.postMessage(item.command);
                                break;
                            case 'HIDEKEYBOARD':
                                this.webview.blur();
                                return;
                            default:
                                this.postMessage(item.command);
                                break;
                        }
                    }}>
                    <Icon name={item.glyph} style={[fontColor, styles.text]}/>
                </TouchableOpacity>);
            })
        }
        else {
            return null;
        }
    }

    render() {
        const {messagesReceivedFromWebView, message} = this.state;

        return (
            <View style={styles.container}>
                <WebView
                    ref={webview => {
                        this.webview = webview;
                    }}
                    source={require('./richeditor.html')}
                    onMessage={this.onMessage}
                />
                {
                    this.state.showToolBar ?
                        <View style={{height: 50}}>
                            <View style={{
                                height: 1,
                                backgroundColor: '#D9E1E9',
                            }}/>
                            <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
                                <View style={styles.buttonContainer}>
                                    {
                                        this.renderButton()
                                    }
                                </View>
                            </ScrollView>
                        </View> : null
                }
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    buttonContainer: {
        flexDirection: 'row',
        alignItems: 'flex-end',
    },
    button: {
        backgroundColor: 'white',
        alignItems: 'center',
        justifyContent: 'center',
        width: 50,
        height: 50,
    },
    text: {
        fontSize: 24,
    },
});
