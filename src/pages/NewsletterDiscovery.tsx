import * as React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { realNewsletterService } from '../services/realNewsletterService';
import { newsletterService } from '../services/newsletterService';
import { RSSFeedService } from '../services/rssFeedService';
import { substackService } from '../services/substackService';
import { Newsletter, NewsletterFilter } from '../types/newsletter';
import { NewsletterCategory, NEWSLETTER_CATEGORIES } from '../constants/categories';
import {
  Box,
  Button,
  Center,
  Flex,
  Grid,
  Heading,
  HStack,
  Image,
  Link,
  SimpleGrid,
  Spinner,
  Stack,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Tag,
  Text,
  useToast,
  VStack,
} from '@chakra-ui/react';

const NEWSLETTERS_PER_PAGE = 10;

export const NewsletterDiscovery: React.FC = () => {
  const [newsletters, setNewsletters] = React.useState<Newsletter[]>([]);
  const [filteredNewsletters, setFilteredNewsletters] = React.useState<Newsletter[]>([]);
  const [rssFeedItems, setRssFeedItems] = React.useState<any[]>([]);
  const [substackNewsletters, setSubstackNewsletters] = React.useState<Newsletter[]>([]);
  const [currentPage, setCurrentPage] = React.useState(1);
  const [loading, setLoading] = React.useState(true);
  const [rssError, setRssError] = React.useState<string | null>(null);
  const [filter, setFilter] = React.useState<NewsletterFilter>({
    category: undefined,
    searchTerm: ''
  });

  const { currentUser } = useAuth();
  const toast = useToast();

  // Calculate pagination values
  const totalNewsletters = filteredNewsletters?.length || 0;
  const totalPages = Math.ceil(totalNewsletters / NEWSLETTERS_PER_PAGE);
  const startIndex = (currentPage - 1) * NEWSLETTERS_PER_PAGE;
  const endIndex = startIndex + NEWSLETTERS_PER_PAGE;
  const currentNewsletters = filteredNewsletters?.slice(startIndex, endIndex) || [];

  React.useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Fetch RSS Feeds
        const rssService = new RSSFeedService();
        const sources = [
          { 
            url: 'https://blog.pragmaticengineer.com/rss/', 
            category: 'Technology',
            backupUrls: ['https://blog.pragmaticengineer.com/feed']
          },
          { 
            url: 'https://jamesclear.com/feed', 
            category: 'Productivity',
            backupUrls: ['https://jamesclear.com/rss']
          },
          { 
            url: 'https://stratechery.com/feed/', 
            category: 'Technology',
            backupUrls: ['https://stratechery.com/rss']
          }
        ];
        const feeds = await rssService.fetchMultipleRSSFeeds(sources);
        if (feeds?.length > 0) {
          const allRssItems = feeds.flatMap(feed => feed.items ? feed.items : []);
          setRssFeedItems(allRssItems);
        }

        // Fetch Substack Newsletters
        const trendingNewsletters = await substackService.getTrendingNewsletters(filter.category);
        setSubstackNewsletters(trendingNewsletters || []);

        // Fetch Regular Newsletters
        const realNewsletters = await realNewsletterService.fetchNewsletters(filter);
        const mockNewsletters = realNewsletters.length === 0 
          ? await newsletterService.fetchNewsletters(filter)
          : [];
        
        setNewsletters([...realNewsletters, ...mockNewsletters]);
      } catch (error) {
        console.error('Error fetching data:', error);
        setRssError(error instanceof Error ? error.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [filter.category]);

  React.useEffect(() => {
    if (newsletters) {
      setFilteredNewsletters(applyFilters(newsletters));
    }
  }, [newsletters, filter]);

  const applyFilters = (newsletterList: Newsletter[]) => {
    if (!newsletterList) return [];
    
    let result = [...newsletterList];

    if (filter.category) {
      result = result.filter(newsletter => 
        newsletter.categories?.includes(filter.category)
      );
    }

    if (filter.searchTerm) {
      const searchLower = filter.searchTerm.toLowerCase();
      result = result.filter(newsletter =>
        newsletter.title.toLowerCase().includes(searchLower) ||
        newsletter.description.toLowerCase().includes(searchLower)
      );
    }

    return result;
  };

  const handleSubscribe = async (newsletter: Newsletter) => {
    if (!currentUser) return;
    
    try {
      await newsletterService.recordUserInteraction({
        userId: currentUser.uid,
        newsletterId: newsletter.id,
        interactionType: 'subscribe',
        timestamp: new Date()
      });
      
      toast({
        title: 'Subscribed!',
        description: `You've successfully subscribed to ${newsletter.title}`,
        status: 'success',
        duration: 3000,
        isClosable: true,
        position: 'bottom-right'
      });
    } catch (error) {
      console.error('Error subscribing:', error);
      toast({
        title: 'Subscription Failed',
        description: 'Unable to subscribe at this time. Please try again later.',
        status: 'error',
        duration: 3000,
        isClosable: true,
        position: 'bottom-right'
      });
    }
  };

  if (loading) {
    return <Center py={8}><Spinner size="xl" color="blue.500" /></Center>;
  }

  return (
    <Box p={4}>
      <Heading mb={6}>Discover Newsletters</Heading>
      
      <Tabs isFitted variant="enclosed" colorScheme="blue" mb={6}>
        <TabList>
          <Tab>Newsletters</Tab>
          <Tab>RSS Feeds</Tab>
          <Tab>Trending on Substack</Tab>
        </TabList>

        <TabPanels>
          <TabPanel>
            {/* Regular newsletters content */}
            <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
              {currentNewsletters.map((newsletter) => (
                <Box
                  key={newsletter.id}
                  borderWidth="1px"
                  borderRadius="lg"
                  overflow="hidden"
                  _hover={{ shadow: 'lg' }}
                  transition="all 0.2s"
                >
                  <Link
                    href={newsletter.websiteUrl}
                    isExternal
                    _hover={{ textDecoration: 'none' }}
                  >
                    <Box position="relative">
                      {newsletter.coverImageUrl && (
                        <Image
                          src={newsletter.coverImageUrl}
                          alt={newsletter.title}
                          height="200px"
                          width="100%"
                          objectFit="cover"
                          transition="transform 0.2s"
                          _hover={{ transform: 'scale(1.05)' }}
                        />
                      )}
                      <Box
                        position="absolute"
                        bottom={0}
                        left={0}
                        right={0}
                        bg="blackAlpha.600"
                        p={4}
                      >
                        <Heading size="md" color="white">
                          {newsletter.title}
                        </Heading>
                        <Text color="whiteAlpha.900" fontSize="sm">
                          By {newsletter.author}
                        </Text>
                      </Box>
                    </Box>
                  </Link>

                  <Stack p={4} spacing={3}>
                    <Text noOfLines={2} color="gray.600">
                      {newsletter.description}
                    </Text>

                    <HStack spacing={2} flexWrap="wrap">
                      {newsletter.categories?.map((category) => (
                        <Tag
                          key={category}
                          size="sm"
                          colorScheme="blue"
                          borderRadius="full"
                        >
                          {category}
                        </Tag>
                      ))}
                    </HStack>

                    {newsletter.subscriberCount && (
                      <Text fontSize="sm" color="gray.500">
                        {newsletter.subscriberCount.toLocaleString()} subscribers
                      </Text>
                    )}

                    <HStack spacing={4}>
                      <Button
                        as="a"
                        href={newsletter.websiteUrl}
                        target="_blank"
                        colorScheme="blue"
                        flex={1}
                        size="sm"
                      >
                        Visit
                      </Button>
                      <Button
                        onClick={() => handleSubscribe(newsletter)}
                        disabled={!currentUser}
                        colorScheme="green"
                        flex={1}
                        size="sm"
                      >
                        {currentUser ? 'Subscribe' : 'Login to Subscribe'}
                      </Button>
                    </HStack>
                  </Stack>
                </Box>
              ))}
            </SimpleGrid>

            {filteredNewsletters.length === 0 && (
              <Center py={8}>
                <Text>No newsletters found. Try adjusting your filters.</Text>
              </Center>
            )}

            {totalPages > 1 && (
              <Center py={8}>
                <HStack spacing={4}>
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                    <Button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      colorScheme="blue"
                      size="sm"
                    >
                      {page}
                    </Button>
                  ))}
                </HStack>
              </Center>
            )}
          </TabPanel>

          <TabPanel>
            {/* RSS Feed content */}
            <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
              {rssFeedItems.map((item, index) => (
                <Box
                  key={index}
                  borderWidth="1px"
                  borderRadius="lg"
                  overflow="hidden"
                  p={4}
                >
                  <VStack align="stretch" spacing={3}>
                    <Link href={item.link} isExternal>
                      <Heading size="md" _hover={{ color: "blue.500" }}>
                        {item.title}
                      </Heading>
                    </Link>
                    <Text noOfLines={3} color="gray.600">
                      {item.description?.replace(/<[^>]*>?/gm, '')}
                    </Text>
                    {item.pubDate && (
                      <Text fontSize="sm" color="gray.500">
                        Published: {new Date(item.pubDate).toLocaleDateString()}
                      </Text>
                    )}
                    <Button
                      as="a"
                      href={item.link}
                      target="_blank"
                      colorScheme="blue"
                      size="sm"
                    >
                      Read More
                    </Button>
                  </VStack>
                </Box>
              ))}
            </SimpleGrid>
            {!rssError && rssFeedItems.length === 0 && (
              <Center py={8}>
                <Text>No RSS feed items available.</Text>
              </Center>
            )}
            {rssError && (
              <Center py={8}>
                <Text color="red.500">{rssError}</Text>
              </Center>
            )}
          </TabPanel>

          <TabPanel>
            {loading ? (
              <Center py={8}>
                <Spinner size="xl" color="blue.500" />
              </Center>
            ) : (
              <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
                {substackNewsletters.map((newsletter) => (
                  <Box
                    key={newsletter.id}
                    borderWidth="1px"
                    borderRadius="lg"
                    overflow="hidden"
                    _hover={{ shadow: 'lg' }}
                    transition="all 0.2s"
                  >
                    <Link
                      href={newsletter.websiteUrl}
                      isExternal
                      _hover={{ textDecoration: 'none' }}
                    >
                      <Box position="relative">
                        {newsletter.coverImageUrl && (
                          <Image
                            src={newsletter.coverImageUrl}
                            alt={newsletter.title}
                            height="200px"
                            width="100%"
                            objectFit="cover"
                            transition="transform 0.2s"
                            _hover={{ transform: 'scale(1.05)' }}
                          />
                        )}
                        <Box
                          position="absolute"
                          bottom={0}
                          left={0}
                          right={0}
                          bg="blackAlpha.600"
                          p={4}
                        >
                          <Heading size="md" color="white">
                            {newsletter.title}
                          </Heading>
                          <Text color="whiteAlpha.900" fontSize="sm">
                            By {newsletter.author}
                          </Text>
                        </Box>
                      </Box>
                    </Link>

                    <Stack p={4} spacing={3}>
                      <Text noOfLines={2} color="gray.600">
                        {newsletter.description}
                      </Text>

                      <HStack spacing={2} flexWrap="wrap">
                        {newsletter.categories?.map((category) => (
                          <Tag
                            key={category}
                            size="sm"
                            colorScheme="blue"
                            borderRadius="full"
                          >
                            {category}
                          </Tag>
                        ))}
                      </HStack>

                      {newsletter.subscriberCount && (
                        <Text fontSize="sm" color="gray.500">
                          {newsletter.subscriberCount.toLocaleString()} subscribers
                        </Text>
                      )}

                      <HStack spacing={4}>
                        <Button
                          as="a"
                          href={newsletter.websiteUrl}
                          target="_blank"
                          colorScheme="blue"
                          flex={1}
                          size="sm"
                        >
                          Visit
                        </Button>
                        <Button
                          onClick={() => handleSubscribe(newsletter)}
                          disabled={!currentUser}
                          colorScheme="green"
                          flex={1}
                          size="sm"
                        >
                          {currentUser ? 'Subscribe' : 'Login to Subscribe'}
                        </Button>
                      </HStack>
                    </Stack>
                  </Box>
                ))}
              </SimpleGrid>
            )}
            {substackNewsletters.length === 0 && (
              <Center py={8}>
                <Text>No Substack newsletters found. Try adjusting your filters.</Text>
              </Center>
            )}
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Box>
  );
};

export default NewsletterDiscovery;
