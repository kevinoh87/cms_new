import React, { useState } from 'react';
import { Brain, TrendingUp, TrendingDown, Loader, CheckCircle, DollarSign, Settings } from 'lucide-react';
import { t } from '../utils/translations';
import { mockPricingRecommendations, mockRooms } from '../utils/mockData';
import { PricingRecommendation } from '../types';
import { PricingWizard } from './PricingWizard';

interface PricingProps {
  language: string;
}

export const Pricing: React.FC<PricingProps> = ({ language }) => {
  const [recommendations, setRecommendations] = useState<PricingRecommendation[]>(mockPricingRecommendations);
  const [isLoading, setIsLoading] = useState(false);
  const [appliedRecommendations, setAppliedRecommendations] = useState<Set<string>>(new Set());
  const [isWizardOpen, setIsWizardOpen] = useState(false);

  const generateRecommendations = async () => {
    setIsLoading(true);
    // Simulate AI processing
    await new Promise(resolve => setTimeout(resolve, 2000));
    setIsLoading(false);
  };

  const applyRecommendation = (roomType: string) => {
    setAppliedRecommendations(prev => new Set([...prev, roomType]));
  };

  const applyAllRecommendations = () => {
    const allRoomTypes = recommendations.map(r => r.roomType);
    setAppliedRecommendations(new Set(allRoomTypes));
  };

  const getPriceChangeIcon = (current: number, recommended: number) => {
    if (recommended > current) {
      return <TrendingUp size={16} className="text-green-600" />;
    } else if (recommended < current) {
      return <TrendingDown size={16} className="text-red-600" />;
    }
    return null;
  };

  const getPriceChangePercentage = (current: number, recommended: number) => {
    return Math.round(((recommended - current) / current) * 100);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{t('pricing', language)}</h1>
          <p className="text-gray-600 mt-1">AI-powered pricing optimization for maximum revenue</p>
        </div>
        <div className="mt-4 sm:mt-0 flex gap-3">
          <button
            onClick={() => setIsWizardOpen(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center"
          >
            <Settings size={20} className="mr-2" />
            Pricing Wizard
          </button>
          <button
            onClick={generateRecommendations}
            disabled={isLoading}
            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors flex items-center disabled:opacity-50"
          >
            {isLoading ? (
              <Loader size={20} className="mr-2 animate-spin" />
            ) : (
              <Brain size={20} className="mr-2" />
            )}
            Generate New Recommendations
          </button>
          <button
            onClick={applyAllRecommendations}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            {t('applyAll', language)}
          </button>
        </div>
      </div>

      {/* Current Pricing Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[...new Set(mockRooms.map(r => r.type))].map(roomType => {
          const typeRooms = mockRooms.filter(r => r.type === roomType);
          const avgPrice = Math.round(typeRooms.reduce((sum, r) => sum + r.price, 0) / typeRooms.length);
          const recommendation = recommendations.find(r => r.roomType === roomType);
          
          return (
            <div key={roomType} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">{roomType}</h3>
                <DollarSign size={24} className="text-blue-600" />
              </div>
              
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Current Rate:</span>
                  <span className="font-bold text-xl">${avgPrice}</span>
                </div>
                
                {recommendation && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">AI Recommended:</span>
                    <div className="flex items-center">
                      <span className="font-bold text-xl text-blue-600 mr-2">
                        ${recommendation.recommendedPrice}
                      </span>
                      {getPriceChangeIcon(recommendation.currentPrice, recommendation.recommendedPrice)}
                    </div>
                  </div>
                )}
                
                <div className="flex justify-between">
                  <span className="text-gray-600">Occupancy Impact:</span>
                  <span className="text-sm text-green-600 font-medium">+12%</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* AI Recommendations */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center">
            <Brain size={24} className="text-blue-600 mr-3" />
            <div>
              <h2 className="text-xl font-semibold text-gray-900">{t('aiRecommendations', language)}</h2>
              <p className="text-gray-600">Based on market demand, competitor analysis, and historical data</p>
            </div>
          </div>
        </div>
        
        {isLoading ? (
          <div className="p-12 text-center">
            <Loader size={32} className="animate-spin mx-auto text-blue-600 mb-4" />
            <p className="text-gray-600">Analyzing market data and generating recommendations...</p>
          </div>
        ) : (
          <div className="p-6">
            <div className="space-y-6">
              {recommendations.map((rec, index) => {
                const isApplied = appliedRecommendations.has(rec.roomType);
                const priceChange = getPriceChangePercentage(rec.currentPrice, rec.recommendedPrice);
                
                return (
                  <div
                    key={index}
                    className={`
                      border rounded-lg p-6 transition-all duration-200
                      ${isApplied ? 'border-green-200 bg-green-50' : 'border-gray-200 hover:border-gray-300'}
                    `}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center mb-2">
                          <h3 className="text-lg font-semibold text-gray-900 mr-3">{rec.roomType}</h3>
                          {isApplied && <CheckCircle size={20} className="text-green-600" />}
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                          <div>
                            <p className="text-sm text-gray-600">Current Price</p>
                            <p className="text-xl font-bold text-gray-900">${rec.currentPrice}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-600">Recommended Price</p>
                            <div className="flex items-center">
                              <p className="text-xl font-bold text-blue-600 mr-2">${rec.recommendedPrice}</p>
                              {getPriceChangeIcon(rec.currentPrice, rec.recommendedPrice)}
                              <span className={`text-sm font-medium ml-1 ${
                                priceChange > 0 ? 'text-green-600' : 'text-red-600'
                              }`}>
                                ({priceChange > 0 ? '+' : ''}{priceChange}%)
                              </span>
                            </div>
                          </div>
                          <div>
                            <p className="text-sm text-gray-600">{t('confidenceLevel', language)}</p>
                            <div className="flex items-center">
                              <div className="flex-1 bg-gray-200 rounded-full h-2 mr-2">
                                <div
                                  className="bg-blue-600 h-2 rounded-full"
                                  style={{ width: `${rec.confidence}%` }}
                                />
                              </div>
                              <span className="text-sm font-medium">{rec.confidence}%</span>
                            </div>
                          </div>
                        </div>
                        
                        <div className="mb-4">
                          <p className="text-sm text-gray-600 mb-1">AI Analysis:</p>
                          <p className="text-gray-800">{rec.reason}</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex justify-end">
                      {!isApplied ? (
                        <button
                          onClick={() => applyRecommendation(rec.roomType)}
                          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                        >
                          Apply Recommendation
                        </button>
                      ) : (
                        <div className="flex items-center text-green-600 font-medium">
                          <CheckCircle size={16} className="mr-2" />
                          Applied Successfully
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Revenue Projection */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Revenue Impact Projection</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <p className="text-sm text-gray-600 mb-1">Current Monthly Revenue</p>
            <p className="text-2xl font-bold text-gray-900">$15,600</p>
          </div>
          <div className="text-center">
            <p className="text-sm text-gray-600 mb-1">Projected with AI Pricing</p>
            <p className="text-2xl font-bold text-green-600">$18,200</p>
          </div>
          <div className="text-center">
            <p className="text-sm text-gray-600 mb-1">Potential Increase</p>
            <p className="text-2xl font-bold text-blue-600">+$2,600</p>
            <p className="text-sm text-green-600">+16.7%</p>
          </div>
        </div>
      </div>

      {/* Pricing Wizard Modal */}
      <PricingWizard
        isOpen={isWizardOpen}
        onClose={() => setIsWizardOpen(false)}
        language={language}
      />
    </div>
  );
};