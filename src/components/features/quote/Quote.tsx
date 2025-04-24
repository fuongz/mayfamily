import { InView } from '@/components/motions/in-view/InView'
import { Title } from '@mantine/core'

function Quote() {
  return (
    <>
      <InView
        variants={{
          hidden: {
            opacity: 0,
            x: 100,
          },
          visible: {
            opacity: 1,
            x: 0,
          },
        }}
        transition={{ duration: 0.5, ease: 'easeInOut' }}
        viewOptions={{ margin: '0px 0px -250px 0px' }}
      >
        <Title c="wedding-red.9" fw={400} fz={{ base: 42, sm: 42 }}>
          Trăm năm tình viên mãn
        </Title>
      </InView>
      <InView
        variants={{
          hidden: {
            opacity: 0,
            x: -100,
          },
          visible: {
            opacity: 1,
            x: 0,
          },
        }}
        transition={{ duration: 0.5, ease: 'easeInOut', delay: 0.5 }}
        viewOptions={{ margin: '0px 0px -250px 0px' }}
      >
        <Title c="wedding-red.9" fw={400} fz={{ base: 42, sm: 42 }}>
          Ngàn năm nghĩa sắt son...
        </Title>
      </InView>
    </>
  )
}

export { Quote }
