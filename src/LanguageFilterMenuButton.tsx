import {
  TextInput,
  Badge,
  Box,
  Button,
  Card,
  Flex,
  Popover,
  Stack,
  Text,
  useClickOutside,
} from '@sanity/ui'
import React, {FormEvent, MouseEventHandler, useCallback, useState} from 'react'
import styled from 'styled-components'
import {LanguageFilterConfig} from './types'
import {usePaneLanguages} from './usePaneLanguages'
import {
  CheckmarkCircleIcon,
  CircleIcon,
  EyeClosedIcon,
  EyeOpenIcon,
  TranslateIcon,
} from '@sanity/icons'
import {TextWithTone} from 'sanity'

const StyledBox = styled(Box)`
  max-height: calc(100vh - 200px);
`

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
  const {activeLanguages, allSelected, selectAll, selectNone, toggleLanguage} = usePaneLanguages()
  const [button, setButton] = useState<HTMLElement | null>(null)
  const [popover, setPopover] = useState<HTMLElement | null>(null)

  const handleToggleAll: MouseEventHandler<HTMLButtonElement> = useCallback(
    (event) => {
      const checked = event.currentTarget.value === 'ALL'

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

  const langCount = options.supportedLanguages.length

  // Search filter query
  const [query, setQuery] = useState(``)
  const handleQuery = useCallback((event: FormEvent<HTMLInputElement>) => {
    if (event.currentTarget.value) {
      setQuery(event.currentTarget.value)
    } else {
      setQuery(``)
    }
  }, [])

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

      <Stack padding={1} space={1}>
        <Button
          mode="bleed"
          onClick={handleToggleAll}
          justify="flex-start"
          value={allSelected ? 'NONE' : 'ALL'}
          disabled={!!query}
        >
          <Flex gap={3} align="center">
            <Text size={2}>
              {allSelected ? (
                <TextWithTone tone="primary">
                  <EyeClosedIcon />
                </TextWithTone>
              ) : (
                <EyeOpenIcon />
              )}
            </Text>
            <Box flex={1}>
              <Text>{allSelected ? `Hide All` : `Show All`}</Text>
            </Box>
          </Flex>
        </Button>

        <Card borderTop />

        {langCount > 4 ? (
          <TextInput onChange={handleQuery} value={query} placeholder="Filter languages" />
        ) : null}

        {languageOptions
          .filter((language) => {
            if (query) {
              return language.title.toLowerCase().includes(query.toLowerCase())
            }
            return true
          })
          .map((lang) => (
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

  const buttonText =
    activeLanguages.length === langCount
      ? `Showing all`
      : `Showing ${activeLanguages.length} / ${langCount}`
  return (
    <Popover content={content} open={open} portal ref={setPopover}>
      <Button
        text={buttonText}
        icon={TranslateIcon}
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
    <Button mode="bleed" onClick={handleChange} justify="flex-start">
      <Flex gap={3} align="center">
        <Text size={2}>
          {selected ? (
            <TextWithTone tone="positive">
              <CheckmarkCircleIcon />
            </TextWithTone>
          ) : (
            <CircleIcon />
          )}
        </Text>
        <Box flex={1}>
          <Text>{title}</Text>
        </Box>
        <Badge>{id}</Badge>
      </Flex>
    </Button>
  )
}
