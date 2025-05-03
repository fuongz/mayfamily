import {
  AspectRatio,
  Button,
  Container,
  Flex,
  Image,
  Stack,
  Text,
  Title,
} from "@mantine/core";
import { IconHeartFilled, IconMapSearch } from "@tabler/icons-react";
function Map() {
  return (
    <Container h="100%">
      <Flex
        direction="column"
        ta="center"
        justify="center"
        align="center"
        h="100%"
      >
        <Title
          pt={16}
          c="wedding-red.9"
          ta="center"
          fw={400}
          fz={{ base: 48, sm: 56 }}
        >
          Bản đồ
        </Title>

        <Flex direction="column">
          <AspectRatio ratio={16 / 9} w="100%" h={{ base: 200, sm: 400 }}>
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d3268.371803254187!2d106.76661492495775!3d10.840675990304527!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x317527a87fcdb123%3A0xaeb846db7ee2f4ff!2sWedding%20Restaurant%20Minh%20Thuy!5e0!3m2!1sen!2sus!4v1746084474401!5m2!1sen!2sus"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </AspectRatio>

          <Stack align="center" justify="center">
            <Button
              component="a"
              href="https://www.google.com/maps/dir/?api=1&destination=Wedding+Restaurant+Minh+Thuy"
              size="lg"
              variant="filled"
              color="yellow.6"
              c="black"
              leftSection={<IconMapSearch />}
              target="_blank"
              mt={8}
            >
              Tìm đường
            </Button>
            <Text
              c="wedding-red.9"
              ta="center"
              fw={500}
              className="text-shadow"
            >
              Made with
              <IconHeartFilled
                style={{
                  display: "inline-block",
                  marginLeft: 4,
                  marginRight: 4,
                }}
                size={16}
              />
              by Trinh & Phương
            </Text>
            <Image
              src="/images/wedding-cartoon.png"
              alt="map"
              w="100px"
              mt={8}
            />
          </Stack>
        </Flex>
      </Flex>
    </Container>
  );
}

export { Map };
