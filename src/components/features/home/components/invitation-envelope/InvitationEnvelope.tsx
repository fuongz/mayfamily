'use client'

import { SlidingNumber } from '@/components/animations/sliding-number/SlidingNumber'
import { Box, Flex, Text, Title, Button } from '@mantine/core'
import { useEffect, useState } from 'react'
import dayjs from 'dayjs'
import duration from 'dayjs/plugin/duration'
import { AnimatedGroup } from '@/components/motions'
import { IconCalendar } from '@tabler/icons-react'

dayjs.extend(duration)

function InvitationEnvelope({ side }: { side: any }) {
  const eventDay = Date.parse(side.countdown)
  const [date, setDate] = useState<string | number>(0)
  const [hours, setHours] = useState<string | number>(0)
  const [minutes, setMinutes] = useState<string | number>(0)
  const [seconds, setSeconds] = useState<string | number>(0)

  const getGoogleCalendarUrl = () => {
    return side.calendar_url
  }

  useEffect(() => {
    const interval = setInterval(() => {
      // biome-ignore lint/suspicious/noExplicitAny: <explanation>
      const timeDuration: Record<string, { [key: string]: number }> | any = dayjs.duration(eventDay - Date.now()) // eslint-disable-line @typescript-eslint/no-explicit-any
      if (timeDuration) {
        setDate(timeDuration.$d.days)
        setHours(timeDuration.$d.hours > 9 ? timeDuration.$d.hours : `0${timeDuration.$d.hours}`)
        setMinutes(timeDuration.$d.minutes > 9 ? timeDuration.$d.minutes : `0${timeDuration.$d.minutes}`)
        setSeconds(timeDuration.$d.seconds > 9 ? timeDuration.$d.seconds : `0${timeDuration.$d.seconds}`)
      }
    }, 1000)
    return () => clearInterval(interval)
  }, [eventDay])

  return (
    <Flex h="100%" ta="center" justify="center" align="center">
      <Flex pos="relative" className="z-10" direction={'column'} gap={{ base: 8, sm: 16 }} py={80} px={32}>
        <AnimatedGroup preset="blur" viewOptions={{ margin: '0px 0px -200px 0px' }}>
          <Title c="wedding-red.9" ff="var(--font-title)" fw={400} fz={{ base: 28, sm: 36 }}>
            Thiệp Mời
          </Title>
          <Text c="gray.9" mt={16} fz={{ base: 20, sm: 28 }}>
            TRÂN TRỌNG KÍNH MỜI
          </Text>
          <Title c="wedding-red.9" fw={400} fz={{ base: 32, sm: 48 }}>
            Quý Khách
          </Title>
          <Text fw={500} fz={{ base: 16, sm: 24 }} c="gray.9">
            Đến dự buổi tiệc chung vui cùng gia đình chúng tôi tại
          </Text>
          <Title className="z-10" pos="relative" c="wedding-red.9" fw={400} fz={{ base: 36, sm: 68 }}>
            {side.location_line_1} <br />
            <Text component="span" fw={400} fz={{ base: 48, sm: 68 }}>
              {side.location_line_2}
            </Text>
          </Title>
          {!!side.location_line_3 && (
            <Title c="gray.9" ta="center" fw={400} ff="var(--font-title)" fz={{ base: 24, sm: 36 }}>
              {side.location_line_3}
            </Title>
          )}
          <Text fw={500} fz={{ base: 16, sm: 24 }} c="gray.9">
            {side.address}
          </Text>
          <Text fw={500} fz={{ base: 16, sm: 24 }} c="gray.9">
            Vào lúc{' '}
            <Text component="span" c="wedding-red.9" fz={{ base: 16, sm: 24 }} fw={600}>
              {side.time}
            </Text>
          </Text>

          <Text c="wedding-red.9" fw={400} ff="var(--font-title)" fz={{ base: 36, sm: 68 }}>
            {side.date}
          </Text>

          <Flex justify="center">
            <div className="flex gap-1">
              <Box>
                <Box fz={{ base: 24, sm: 56 }} fw={600} px={{ base: 4, sm: 12 }} py={{ base: 8, sm: 16 }} className="rounded" c="wedding-red.9" bd={'2px solid var(--mantine-color-wedding-red-9)'}>
                  <SlidingNumber value={date} padStart={true} />
                </Box>
                <Text mt={4} fw={600} fz={14} c="gray.7">
                  ngày
                </Text>
              </Box>
              <Text c="wedding-red.9" fz={{ base: 24, sm: 48 }} mt={{ base: 8, sm: 8 }}>
                :
              </Text>
              <Box>
                <Box fz={{ base: 24, sm: 56 }} fw={600} px={{ base: 4, sm: 12 }} py={{ base: 8, sm: 16 }} className="rounded" c="wedding-red.9" bd={'2px solid var(--mantine-color-wedding-red-9)'}>
                  <SlidingNumber value={hours} padStart={true} />
                </Box>
                <Text mt={4} fw={600} fz={14} c="gray.7">
                  giờ
                </Text>
              </Box>
              <Text c="wedding-red.9" fz={{ base: 24, sm: 48 }} mt={{ base: 8, sm: 8 }}>
                :
              </Text>
              <Box>
                <Box fz={{ base: 24, sm: 56 }} fw={600} px={{ base: 4, sm: 12 }} py={{ base: 8, sm: 16 }} className="rounded" c="wedding-red.9" bd={'2px solid var(--mantine-color-wedding-red-9)'}>
                  <SlidingNumber value={minutes} padStart={true} />
                </Box>
                <Text mt={4} fw={600} fz={14} c="gray.7">
                  phút
                </Text>
              </Box>
              <Text c="wedding-red.9" fz={{ base: 24, sm: 48 }} mt={{ base: 8, sm: 8 }}>
                :
              </Text>
              <Box>
                <Box fz={{ base: 24, sm: 56 }} fw={600} px={{ base: 4, sm: 12 }} py={{ base: 8, sm: 16 }} className="rounded" c="wedding-red.9" bd={'2px solid var(--mantine-color-wedding-red-9)'}>
                  <SlidingNumber value={seconds} padStart={true} />
                </Box>
                <Text mt={4} fw={600} fz={14} c="gray.7">
                  giây
                </Text>
              </Box>
            </div>
          </Flex>

          <Button component="a" href={getGoogleCalendarUrl()} size="lg" variant="filled" color="yellow.6" c="black" leftSection={<IconCalendar />} target="_blank" mt={16}>
            Lưu lại sự kiện
          </Button>
        </AnimatedGroup>
      </Flex>
    </Flex>
  )
}

export { InvitationEnvelope }
