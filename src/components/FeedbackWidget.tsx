import React, { useState } from 'react';
import {
  Box,
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  VStack,
  Textarea,
  useDisclosure,
  Text,
  useToast
} from '@chakra-ui/react';

const FeedbackWidget: React.FC = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [feedback, setFeedback] = useState('');
  const toast = useToast();

  const handleSubmit = async () => {
    if (!feedback.trim()) {
      toast({
        title: "Feedback Required",
        description: "Please enter your feedback before submitting.",
        status: "warning",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    try {
      // TODO: Replace with actual feedback submission endpoint
      const response = await fetch('/api/feedback', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          feedback, 
          timestamp: new Date().toISOString() 
        }),
      });

      if (response.ok) {
        toast({
          title: "Feedback Submitted",
          description: "Thank you for helping us improve!",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
        setFeedback('');
        onClose();
      } else {
        throw new Error('Feedback submission failed');
      }
    } catch (error) {
      toast({
        title: "Submission Error",
        description: "We couldn't submit your feedback. Please try again.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  return (
    <Box>
      <Button 
        onClick={onOpen} 
        colorScheme="blue" 
        variant="outline"
        position="fixed"
        right={4}
        bottom={4}
        zIndex={1000}
      >
        Give Feedback
      </Button>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Help Us Improve</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <VStack spacing={4}>
              <Text>
                We're constantly working to make Discover My Newsletters better. 
                Your feedback is invaluable in shaping our future!
              </Text>
              <Textarea 
                placeholder="Share your thoughts, suggestions, or any issues you've encountered..."
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                size="md"
                height="200px"
              />
            </VStack>
          </ModalBody>
          <ModalFooter>
            <Button 
              colorScheme="blue" 
              mr={3} 
              onClick={handleSubmit}
              isDisabled={!feedback.trim()}
            >
              Submit Feedback
            </Button>
            <Button variant="ghost" onClick={onClose}>Cancel</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default FeedbackWidget;
