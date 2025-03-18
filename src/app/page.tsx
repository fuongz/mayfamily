import { Container, Group, Image, Text, Title } from '@mantine/core'
import classes from './styles.module.css'

export default function Home() {
  return (
    <div className={classes.root}>
      <div className="absolute top-0 z-[-2] h-screen w-screen rotate-180 transform bg-white bg-[radial-gradient(60%_120%_at_50%_50%,hsla(0,0%,100%,0)_0,rgba(252,205,238,.5)_100%)]"></div>
      <Container size="lg">
        <div className={classes.inner}>
          <div className={classes.content}>
            <Title order={1} fz={{ base: 32, sm: 48 }} c="bright">
              Coming soon!
            </Title>

            <Text size="xl" mt={56} c="dimmed">
              Trang web của tụi mình đang trong quá trình hoàn thiện, chờ tụi mình thêm chút thời gian nha!
            </Text>

            <Group justify="center" align="flex-start" gap="xl">
              <Image style={{ borderRadius: '8px' }} mt="xl" w={500} src="https://media.tenor.com/7pyDepP8SOQAAAAM/cat-wif.gif" alt="gif" />
              <Image style={{ borderRadius: '8px' }} mt="xl" w={500} src="https://media.tenor.com/GZDrcsyYnQIAAAAM/locuraaa.gif" alt="gif" />
            </Group>
          </div>
        </div>
      </Container>
    </div>
  )
}
