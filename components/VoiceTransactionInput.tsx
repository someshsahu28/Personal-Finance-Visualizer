'use client';

import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Mic, MicOff, Volume2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface VoiceTransactionInputProps {
  onTransactionParsed?: (transaction: {
    amount: number;
    description: string;
    type: 'income' | 'expense';
    category: string;
  }) => void;
  onTransactionSubmit?: (transaction: {
    amount: number;
    description: string;
    type: 'income' | 'expense';
    category: string;
    date: string;
  }) => void;
  onClose: () => void;
}

export default function VoiceTransactionInput({ onTransactionParsed, onTransactionSubmit, onClose }: VoiceTransactionInputProps) {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [isSupported, setIsSupported] = useState(false);
  const [recognition, setRecognition] = useState<any>(null);
  const [retryCount, setRetryCount] = useState(0);
  const transcriptRef = useRef('');
  const processedRef = useRef(false);

  useEffect(() => {
    // Check if speech recognition is supported
    if (typeof window !== 'undefined') {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      
      if (SpeechRecognition) {
        setIsSupported(true);
        const recognitionInstance = new SpeechRecognition();
        
        recognitionInstance.continuous = false;
        recognitionInstance.interimResults = true;
        recognitionInstance.lang = 'en-US';

        recognitionInstance.onresult = (event: any) => {
          const current = event.resultIndex;
          const result = event.results[current];
          const transcriptResult = result[0].transcript;
          console.log('Voice transcript:', transcriptResult, 'final:', result.isFinal);
          setTranscript(transcriptResult);
          transcriptRef.current = transcriptResult;

          // Auto-process immediately on final result
          if (result.isFinal && !processedRef.current) {
            processedRef.current = true;
            const finalText = transcriptResult.trim();
            if (finalText) {
              parseVoiceInput(finalText);
            }
          }
        };

        recognitionInstance.onend = () => {
          console.log('Speech recognition ended, transcript:', transcriptRef.current);
          setIsListening(false);

          // If we haven't processed a final result, process whatever we have
          setTimeout(() => {
            if (!processedRef.current) {
              const currentTranscript = transcriptRef.current.trim();
              console.log('Processing transcript (onend fallback):', currentTranscript);
              if (currentTranscript) {
                parseVoiceInput(currentTranscript);
              }
            }
            processedRef.current = false; // reset for next session
          }, 400);
        };

        recognitionInstance.onerror = (event: any) => {
          console.error('Speech recognition error:', event.error);
          setIsListening(false);

          // Handle common errors with retries
          if ((event.error === 'no-speech' || event.error === 'audio-capture') && retryCount < 2) {
            console.log('Retrying speech recognition... (attempt', retryCount + 1, ')');
            setRetryCount((c) => c + 1);
            setTimeout(() => {
              processedRef.current = false;
              transcriptRef.current = '';
              setTranscript('');
              setIsListening(true);
              recognitionInstance.start();
            }, 300);
          }
        };

        setRecognition(recognitionInstance);
      }
    }
  }, []);

  const startListening = () => {
    if (recognition) {
      setRetryCount(0);
      processedRef.current = false;
      setTranscript('');
      transcriptRef.current = '';
      setIsListening(true);
      recognition.start();
    }
  };

  const stopListening = () => {
    if (recognition) {
      recognition.stop();
      setIsListening(false);
    }
  };

  const parseVoiceInput = (text: string) => {
    try {
      console.log('Parsing voice input:', text);
      const lowerText = text.toLowerCase();

      // Extract amount - more flexible patterns
      let amountMatch = lowerText.match(/(\d+(?:\.\d{1,2})?)\s*(?:rupees?|rs\.?|₹)/);
      if (!amountMatch) {
        // Try just numbers
        amountMatch = lowerText.match(/(\d+(?:\.\d{1,2})?)/);
      }

      const amount = amountMatch ? parseFloat(amountMatch[1]) : 0;
      console.log('Extracted amount:', amount);

      // Determine transaction type
      const isIncome = lowerText.includes('income') ||
                      lowerText.includes('salary') ||
                      lowerText.includes('earned') ||
                      lowerText.includes('received') ||
                      lowerText.includes('got paid') ||
                      lowerText.includes('receive');

      const type: 'income' | 'expense' = isIncome ? 'income' : 'expense';
      console.log('Transaction type:', type);

      // Extract category based on keywords
      let category = 'other';

      if (type === 'expense') {
        if (lowerText.includes('food') || lowerText.includes('restaurant') || lowerText.includes('lunch') || lowerText.includes('dinner') || lowerText.includes('coffee') || lowerText.includes('tea') || lowerText.includes('breakfast')) {
          category = 'food';
        } else if (lowerText.includes('petrol') || lowerText.includes('gas') || lowerText.includes('uber') || lowerText.includes('taxi') || lowerText.includes('transport') || lowerText.includes('bus') || lowerText.includes('auto')) {
          category = 'transportation';
        } else if (lowerText.includes('shopping') || lowerText.includes('clothes') || lowerText.includes('bought') || lowerText.includes('purchase')) {
          category = 'shopping';
        } else if (lowerText.includes('movie') || lowerText.includes('entertainment') || lowerText.includes('game')) {
          category = 'entertainment';
        } else if (lowerText.includes('bill') || lowerText.includes('electricity') || lowerText.includes('water') || lowerText.includes('internet')) {
          category = 'bills';
        } else if (lowerText.includes('doctor') || lowerText.includes('medicine') || lowerText.includes('hospital')) {
          category = 'healthcare';
        }
      } else {
        if (lowerText.includes('salary') || lowerText.includes('job') || lowerText.includes('work')) {
          category = 'salary';
        } else if (lowerText.includes('freelance') || lowerText.includes('project')) {
          category = 'freelance';
        }
      }

      console.log('Category:', category);

      // Create a cleaner description
      let description = text.replace(/\d+(?:\.\d{1,2})?\s*(?:rupees?|rs\.?|₹)?/gi, '').trim();
      description = description.replace(/^(spent|paid|bought|received|got|earned)\s*/i, '').trim();
      if (!description) {
        description = `${type} transaction`;
      }

      console.log('Description:', description);

      const parsedTransaction = {
        amount,
        description,
        type,
        category,
        date: new Date().toISOString().split('T')[0] // Today's date
      };

      console.log('Parsed transaction:', parsedTransaction);

      if (amount > 0) {
        if (onTransactionSubmit) {
          console.log('Auto-submitting transaction:', parsedTransaction);
          onTransactionSubmit(parsedTransaction);
          onClose(); // Close the voice input after successful submission
        } else if (onTransactionParsed) {
          console.log('Calling onTransactionParsed with:', parsedTransaction);
          onTransactionParsed(parsedTransaction);
        }
      } else {
        console.log('Amount is 0 or invalid, not creating transaction');
      }
    } catch (error) {
      console.error('Error parsing voice input:', error);
    }
  };

  const speakInstructions = () => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(
        "Say something like: Spent 25 rupees on lunch at restaurant, or Received 1000 rupees salary income"
      );
      speechSynthesis.speak(utterance);
    }
  };

  if (!isSupported) {
    return (
      <Card className="w-full max-w-md mx-auto">
        <CardHeader>
          <CardTitle className="text-center text-red-600">
            Speech Recognition Not Supported
          </CardTitle>
        </CardHeader>
        <CardContent className="text-center">
          <p className="text-sm text-gray-600 mb-4">
            Your browser doesn't support speech recognition. Please use Chrome or Edge for voice input.
          </p>
          <Button onClick={onClose} variant="outline">
            Close
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="text-center flex items-center justify-center space-x-2">
          <Mic className="w-5 h-5" />
          <span>Voice Transaction Entry</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="text-center">
          <Button
            onClick={speakInstructions}
            variant="outline"
            size="sm"
            className="mb-4"
          >
            <Volume2 className="w-4 h-4 mr-2" />
            Hear Examples
          </Button>
        </div>

        <div className="text-center">
          <Button
            onClick={isListening ? stopListening : startListening}
            className={`w-20 h-20 rounded-full ${
              isListening 
                ? 'bg-red-500 hover:bg-red-600 animate-pulse' 
                : 'bg-blue-500 hover:bg-blue-600'
            }`}
          >
            {isListening ? (
              <MicOff className="w-8 h-8 text-white" />
            ) : (
              <Mic className="w-8 h-8 text-white" />
            )}
          </Button>
        </div>

        <div className="text-center">
          <p className="text-sm text-gray-600">
            {isListening ? 'Listening... Speak now!' : 'Click the microphone to start'}
          </p>
        </div>

        {transcript && (
          <div className="p-3 bg-gray-50 rounded-lg">
            <p className="text-sm font-medium text-gray-700">You said:</p>
            <p className="text-sm text-gray-900">"{transcript}"</p>
            <Button
              onClick={() => parseVoiceInput(transcriptRef.current || transcript)}
              className="mt-2 w-full"
              size="sm"
            >
              Process Transaction
            </Button>
          </div>
        )}

        <div className="text-xs text-gray-500 space-y-1">
          <p><strong>Examples:</strong></p>
          <p>• "Spent 25 rupees on lunch"</p>
          <p>• "Paid 50 rupees for petrol"</p>
          <p>• "Received 1000 rupees salary income"</p>
          <p>• "Bought coffee for 50 rupees"</p>
        </div>

        <div className="flex space-x-2">
        <Button onClick={onClose} variant="outline" className="w-full">
            Cancel
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
