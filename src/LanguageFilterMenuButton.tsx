import {TranslateIcon} from '@sanity/icons'
import {Box, Button, Card, Checkbox, Flex, Popover, Stack, Text, useClickOutside} from '@sanity/ui'
import React, {FormEvent, useCallback, useState} from 'react'
import {usePaneLanguages} from './usePaneLanguages'
import {LanguageFilterConfig} from './types'

export interface LanguageFilterMenuButtonProps {
  options: LanguageFilterConfig
}

export function LanguageFilterMenuButton(props: LanguageFilterMenuButtonProps) {
  const {options} = props
  const defaultLanguages = options.supportedLanguages.filter((l) =>
    options.defaultLanguages?.includes(l.id)
  )
  const languageOptions = options.supportedLanguages.filter(
    (l) => !options.defaultLanguages?.includes(l.id)
  )
  const [open, setOpen] = useState(false)
  const {visibleLanguages, allSelected, selectAll, selectNone, toggleLanguage} = usePaneLanguages({
    options,
  })
  const [button, setButton] = useState<HTMLElement | null>(null)
  const [popover, setPopover] = useState<HTMLElement | null>(null)

  const handleToggleAll = useCallback(
    (event: FormEvent<HTMLInputElement>) => {
      const checked = event.currentTarget.checked

      if (checked) {
        selectAll()
      } else {
        selectNone()
      }
    },
    [selectAll, selectNone]
  )

  const handleClick = useCallback(() => setOpen((o) => !o), [])

  const handleClickOutside = useCallback(() => setOpen(false), [])

  useClickOutside(handleClickOutside, [button, popover])

  const content = (
    <Box overflow="auto" padding={1}>
      {defaultLanguages.length > 0 && (
        <Card radius={2} tone="primary">
          <Stack padding={2} space={3}>
            <Text size={1} weight="semibold">
              Default language{defaultLanguages.length > 1 && <>s</>}
            </Text>

            {defaultLanguages.map((l) => (
              <Text key={l.id}>{l.title}</Text>
            ))}
          </Stack>
        </Card>
      )}

      <Stack marginTop={3} padding={2} space={2}>
        <Box paddingBottom={1}>
          <Text size={1} weight="semibold">
            Show translations
          </Text>
        </Box>

        <Card as="label">
          <Flex align="center" gap={2}>
            <Checkbox checked={allSelected} name="_allSelected" onChange={handleToggleAll} />
            <Box flex={1}>
              <Text muted={!allSelected} weight="semibold">
                All translations
              </Text>
            </Box>
          </Flex>
        </Card>

        {languageOptions.map((lang) => (
          <LanguageFilterOption
            id={lang.id}
            key={lang.id}
            onToggle={toggleLanguage}
            selected={visibleLanguages.includes(lang.id)}
            title={lang.title}
          />
        ))}
      </Stack>
    </Box>
  )

  return (
    <Popover constrainSize content={content} open={open} portal ref={setPopover}>
      <Button
        icon={TranslateIcon}
        text={`Filter languages (${visibleLanguages.length}/${options.supportedLanguages.length})`}
        mode="bleed"
        onClick={handleClick}
        ref={setButton}
        selected={open}
      />
    </Popover>
  )
}

function LanguageFilterOption(props: {
  id: string
  onToggle: (id: string) => void
  selected: boolean
  title: string
}) {
  const {id, onToggle, selected, title} = props

  const handleChange = useCallback(() => {
    onToggle(id)
  }, [id, onToggle])

  return (
    <Card as="label">
      <Flex align="center" gap={2}>
        <Checkbox checked={selected} name={`language-${id}`} onChange={handleChange} />
        <Box flex={1}>
          <Text muted={!selected}>{title}</Text>
        </Box>
      </Flex>
    </Card>
  )
}
