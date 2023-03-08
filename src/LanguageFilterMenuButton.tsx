import {Box, Button, Card, Checkbox, Flex, Popover, Stack, Text, useClickOutside} from '@sanity/ui'
import React, {FormEvent, useCallback, useState} from 'react'
import styled from 'styled-components'
import {LanguageFilterConfig} from './types'
import {usePaneLanguages} from './usePaneLanguages'

const StyledBox = styled(Box)`
  max-height: calc(100vh - 200px);
`

export interface LanguageFilterMenuButtonProps {
  options: LanguageFilterConfig
  onSelectedIdsChange: (ids: string[]) => void
}

export function LanguageFilterMenuButton(props: LanguageFilterMenuButtonProps) {
  const {options, onSelectedIdsChange} = props

  const defaultLanguages = options.supportedLanguages.filter((l) =>
    options.defaultLanguages?.includes(l.id)
  )

  const languageOptions = options.supportedLanguages.filter(
    (l) => !options.defaultLanguages?.includes(l.id)
  )
  const [open, setOpen] = useState(false)
  const {activeLanguages, allSelected, selectAll, selectNone, toggleLanguage} = usePaneLanguages({
    options,
    onSelectedIdsChange,
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
    <StyledBox overflow="auto" padding={1}>
      {defaultLanguages.length > 0 && (
        <Card radius={2}>
          <Stack padding={2} space={3}>
            <Box paddingBottom={2}>
              <Text size={1} weight="semibold">
                Default language{defaultLanguages.length > 1 && <>s</>}
              </Text>
            </Box>

            {defaultLanguages.map((l) => (
              <Text key={l.id}>{l.title}</Text>
            ))}
          </Stack>
        </Card>
      )}

      <Stack marginTop={3} padding={2} space={2}>
        <Box paddingBottom={2}>
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
            selected={activeLanguages.includes(lang.id)}
            title={lang.title}
          />
        ))}
      </Stack>
    </StyledBox>
  )

  const langCount = options.supportedLanguages.length
  return (
    <Popover content={content} open={open} portal ref={setPopover}>
      <Button
        text={
          <Flex gap={1}>
            <Box>Filter languages:</Box>
            <Flex gap={1} justify="space-around">
              <Flex
                style={{width: `${Math.floor(Math.log10(langCount) + 1)}ch`}}
                justify="flex-end"
              >
                {activeLanguages.length}
              </Flex>
              <Box>/</Box>
              <Box>{langCount}</Box>
            </Flex>
          </Flex>
        }
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
