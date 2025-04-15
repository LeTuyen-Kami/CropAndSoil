import { useState } from "react";
import { WebView, WebViewMessageEvent } from "react-native-webview";

const WebViewContent = ({ html }: { html: string }) => {
  const [webViewHeight, setWebViewHeight] = useState(0);

  const onWebViewMessage = (event: WebViewMessageEvent) => {
    setWebViewHeight(Number(event.nativeEvent.data));
  };

  return (
    <WebView
      source={{
        html: `
      <!DOCTYPE html>
      <html>
        <head>
          <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
          <style>
            body {
              font-family: -apple-system, system-ui, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
              color: #545454;
              font-size: 14px;
              line-height: 1.5;
              margin: 0;
              padding: 0;
            }
            img {
              max-width: 100%;
              height: auto;
              border-radius: 8px;
            }
            p {
              margin: 8px 0;
            }
            h1, h2, h3, h4, h5, h6 {
              color: #383B45;
              font-weight: bold;
              margin-top: 16px;
              margin-bottom: 8px;
            }
            ul, ol {
              padding-left: 20px;
            }
            li {
              margin-bottom: 6px;
            }
            a {
              color: #159747;
              text-decoration: none;
            }
            table {
              border-collapse: collapse;
              width: 100%;
              margin: 16px 0;
            }
            th, td {
              border: 1px solid #F0F0F0;
              padding: 8px;
              text-align: left;
            }
            th {
              background-color: #f8f8f8;
            }
          </style>
        </head>
        <body>
          ${html || ""}
          <script>
            // Send height to React Native
            window.onload = function() {
              window.ReactNativeWebView.postMessage(document.body.scrollHeight);
            };
          </script>
        </body>
      </html>
    `,
      }}
      style={{ width: "100%", height: webViewHeight + 20 }}
      onMessage={onWebViewMessage}
      scrollEnabled={false}
      showsVerticalScrollIndicator={false}
      originWhitelist={["*"]}
    />
  );
};

export default WebViewContent;
