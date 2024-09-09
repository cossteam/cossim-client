import React from 'react';
import { Button, ConfigProvider } from 'antd';
import { ButtonProps } from 'antd/lib/button';

const ThemeButton: React.FC<ButtonProps> = (props) => {
  return (
    <ConfigProvider
      wave={{ disabled: true }}
      theme={{
        components: {
          Button: {
            defaultBg: "hsl(var(--primary))",
            defaultBorderColor: "hsl(var(--primary))",
            defaultColor: "hsl(var(--primary-foreground))",
            primaryColor: "hsl(var(--primary-foreground))",
            defaultHoverBg: "hsl(var(--primary))",
            defaultHoverBorderColor: "hsl(var(--primary))",
            defaultHoverColor: "hsl(var(--primary-foreground))",
            defaultActiveBg: "hsl(var(--primary))",
            defaultActiveBorderColor: "hsl(var(--primary))",
            defaultActiveColor: "hsl(var(--primary-foreground))",
          },
        },
      }}
    >
      <Button {...props} />
    </ConfigProvider>
  );
};

export default ThemeButton;