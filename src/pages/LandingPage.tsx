import React from 'react';
import { 
  Box, 
  VStack, 
  Heading, 
  Text, 
  Button, 
  Container, 
  Flex, 
  Icon,
  SimpleGrid
} from '@chakra-ui/react';
import { 
  FaNewspaper, 
  FaSearch, 
  FaFilter, 
  FaRocket 
} from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const FeatureCard: React.FC<{
  icon: React.ElementType, 
  title: string, 
  description: string
}> = ({ icon, title, description }) => (
  <Box 
    p={6} 
    borderWidth={1} 
    borderRadius="lg" 
    textAlign="center"
    boxShadow="md"
    transition="all 0.3s"
    _hover={{
      transform: 'translateY(-10px)',
      boxShadow: 'xl'
    }}
  >
    <Icon as={icon} w={10} h={10} color="blue.500" mb={4} />
    <Heading size="md" mb={3}>{title}</Heading>
    <Text color="gray.600">{description}</Text>
  </Box>
);

export const LandingPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <Box>
      {/* Hero Section */}
      <Box 
        bgGradient="linear(to-r, blue.400, purple.500)"
        color="white"
        py={20}
        textAlign="center"
      >
        <Container maxW="container.xl">
          <Heading 
            as="h1" 
            size="3xl" 
            mb={4}
            fontWeight="extrabold"
          >
            Discover Your Perfect Newsletter
          </Heading>
          <Text 
            fontSize="xl" 
            mb={8}
            maxW="600px"
            mx="auto"
          >
            Curate your reading experience with personalized newsletter recommendations 
            across technology, startups, programming, and more.
          </Text>
          <Button
            size="lg"
            colorScheme="whiteAlpha"
            onClick={() => navigate('/signup')}
          >
            Get Started - It's Free!
          </Button>
        </Container>
      </Box>

      {/* Features Section */}
      <Container maxW="container.xl" py={16}>
        <Heading 
          textAlign="center" 
          mb={12} 
          size="xl"
        >
          Why Discover My Newsletters?
        </Heading>
        <SimpleGrid columns={[1, 2, 4]} spacing={8}>
          <FeatureCard 
            icon={FaNewspaper}
            title="Curated Content"
            description="Hand-picked newsletters from top creators and publications."
          />
          <FeatureCard 
            icon={FaSearch}
            title="Smart Discovery"
            description="Find newsletters tailored to your interests and reading preferences."
          />
          <FeatureCard 
            icon={FaFilter}
            title="Easy Filtering"
            description="Quickly sort and find newsletters by category, popularity, and more."
          />
          <FeatureCard 
            icon={FaRocket}
            title="Continuous Updates"
            description="Our collection grows with the latest and most exciting newsletters."
          />
        </SimpleGrid>
      </Container>

      {/* Call to Action */}
      <Box 
        bg="gray.100" 
        py={16} 
        textAlign="center"
      >
        <Container maxW="container.xl">
          <Heading mb={6}>
            Ready to Expand Your Knowledge?
          </Heading>
          <Text 
            fontSize="xl" 
            mb={8}
            maxW="600px"
            mx="auto"
          >
            Join thousands of curious minds discovering incredible newsletters 
            that spark inspiration and fuel learning.
          </Text>
          <Button
            size="lg"
            colorScheme="blue"
            onClick={() => navigate('/signup')}
          >
            Create Your Free Account
          </Button>
        </Container>
      </Box>
    </Box>
  );
};
