import { Flex } from 'antd'
import React, { memo, useMemo } from 'react'
import Picker from '@emoji-mart/react'
import useCommonStore from '@/stores/common'
import data from '@/assets/json/emojis.json'
import { $t } from '@/i18n'

export interface MessageEmojisProps {
    selectEmoji?: (emoji: string) => void
}

const MessageEmojis: React.FC<MessageEmojisProps> = memo(({ selectEmoji }) => {
    const commonStore = useCommonStore()

    const i18n = useMemo(
        () => ({
            search: $t('搜索'),
            search_no_results_1: $t('哦不！'),
            search_no_results_2: $t('没有找到相关表情'),
            pick: $t('选择一个表情…'),
            add_custom: $t('添加自定义表情'),
            categories: {
                activity: $t('活动'),
                custom: $t('自定义'),
                flags: $t('旗帜'),
                foods: $t('食物与饮品'),
                frequent: $t('最近使用'),
                nature: $t('动物与自然'),
                objects: $t('物品'),
                people: $t('表情与角色'),
                places: $t('旅行与景点'),
                search: $t('搜索结果'),
                symbols: $t('符号')
            },
            skins: {
                '1': $t('默认'),
                '2': $t('白色'),
                '3': $t('偏白'),
                '4': $t('中等'),
                '5': $t('偏黑'),
                '6': $t('黑色'),
                choose: $t('选择默认肤色')
            }
        }),
        [commonStore.lang]
    )

    return (
        <Flex className="emojis-picker mobile:w-[400px] w-full border">
            <Picker
                className="!w-full"
                data={data}
                onEmojiSelect={(emojis: any) => selectEmoji && selectEmoji(emojis.native)}
                dynamicWidth={true}
                locale={commonStore.lang}
                previewPosition="none"
                searchPosition="none"
                emojiSize="30"
                emojiButtonSize="48"
                theme={commonStore.theme}
                i18n={i18n}
            />
        </Flex>
    )
})

export default MessageEmojis
