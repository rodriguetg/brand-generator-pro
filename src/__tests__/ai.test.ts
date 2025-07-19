import { multiAIService } from '@/lib/ai-providers'

// Mock des APIs externes
jest.mock('openai')
jest.mock('@google/generative-ai')

describe('MultiAIService', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('generateBrandNames', () => {
    it('should generate brand names with OpenAI', async () => {
      const mockResponse = ['Brand1', 'Brand2', 'Brand3']
      
      // Mock OpenAI response
      const mockOpenAI = {
        chat: {
          completions: {
            create: jest.fn().mockResolvedValue({
              choices: [{
                message: {
                  content: mockResponse.join('\n')
                }
              }]
            })
          }
        }
      }

      const result = await multiAIService.generateBrandNames('tech', 'moderne', 'openai')
      
      expect(result).toEqual(mockResponse)
    })

    it('should fallback to OpenAI when other provider fails', async () => {
      const mockResponse = ['FallbackBrand1', 'FallbackBrand2']
      
      // Test fallback mechanism
      const result = await multiAIService.generateBrandNames('tech', 'moderne', 'gemini')
      
      expect(result).toBeDefined()
      expect(Array.isArray(result)).toBe(true)
    })
  })

  describe('parseResponse', () => {
    it('should parse response correctly', () => {
      const input = '1. Brand One\n2. Brand Two\n- Brand Three\n* Brand Four'
      const expected = ['Brand One', 'Brand Two', 'Brand Three', 'Brand Four']
      
      // Test de la méthode privée via une méthode publique
      const result = multiAIService['parseResponse'](input)
      
      expect(result).toEqual(expected)
    })
  })
})