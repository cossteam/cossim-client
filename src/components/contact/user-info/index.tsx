import React from "react";
import { Flex, Typography } from "antd";
import useMobile from "@/hooks/useMobile";
import UserInfoCard from "./card";

const { Text } = Typography;

interface ContactUserInfoProps {
    userId: string;
}

const ContactUserInfo: React.FC<ContactUserInfoProps> = ({ userId }) => {
    const { height } = useMobile();

    return (
        <Flex className="flex-1 container--background flex flex-col" style={{ height }} vertical>
            <div className="h-[49px] flex items-center justify-between bg-white border-b px-4 flex-shrink-0">
                <Text className="flex-1 text-center">用户信息</Text>
            </div>

            <div className="flex-1 overflow-y-auto p-5">
                <UserInfoCard userId={userId} />
            </div>
        </Flex>
    )
}

export default ContactUserInfo;