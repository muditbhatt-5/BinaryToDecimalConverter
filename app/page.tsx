"use client";

import { useState, useEffect } from 'react';
import { Calculator, Copy, RotateCcw, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';

interface ConversionStep {
  step: string;
  calculation: string;
  result: string;
}

export default function Home() {
  const [inputValue, setInputValue] = useState('');
  const [inputType, setInputType] = useState<'decimal' | 'binary'>('decimal');
  const [result, setResult] = useState('');
  const [steps, setSteps] = useState<ConversionStep[]>([]);
  const [isValid, setIsValid] = useState(true);
  const [copied, setCopied] = useState(false);

  const validateInput = (value: string, type: 'decimal' | 'binary'): boolean => {
    if (!value) return true;
    
    if (type === 'decimal') {
      return /^\d+$/.test(value) && parseInt(value) >= 0;
    } else {
      return /^[01]+$/.test(value);
    }
  };

  const decimalToBinary = (decimal: number): { binary: string; steps: ConversionStep[] } => {
    if (decimal === 0) return { binary: '0', steps: [{ step: '1', calculation: '0 ÷ 2 = 0', result: 'Remainder: 0' }] };
    
    const steps: ConversionStep[] = [];
    let num = decimal;
    let stepCount = 1;
    const remainders: number[] = [];

    while (num > 0) {
      const quotient = Math.floor(num / 2);
      const remainder = num % 2;
      remainders.unshift(remainder);
      
      steps.push({
        step: stepCount.toString(),
        calculation: `${num} ÷ 2 = ${quotient}`,
        result: `Remainder: ${remainder}`
      });
      
      num = quotient;
      stepCount++;
    }

    return { binary: remainders.join(''), steps };
  };

  const binaryToDecimal = (binary: string): { decimal: number; steps: ConversionStep[] } => {
    const steps: ConversionStep[] = [];
    let decimal = 0;
    const length = binary.length;

    for (let i = 0; i < length; i++) {
      const bit = parseInt(binary[i]);
      const power = length - 1 - i;
      const value = bit * Math.pow(2, power);
      decimal += value;

      steps.push({
        step: (i + 1).toString(),
        calculation: `${bit} × 2^${power} = ${value}`,
        result: `Running total: ${decimal}`
      });
    }

    return { decimal, steps };
  };

  const handleConvert = () => {
    if (!inputValue || !isValid) return;

    if (inputType === 'decimal') {
      const decimal = parseInt(inputValue);
      const { binary, steps: conversionSteps } = decimalToBinary(decimal);
      setResult(binary);
      setSteps(conversionSteps);
    } else {
      const { decimal, steps: conversionSteps } = binaryToDecimal(inputValue);
      setResult(decimal.toString());
      setSteps(conversionSteps);
    }
  };

  const handleInputChange = (value: string) => {
    setInputValue(value);
    const valid = validateInput(value, inputType);
    setIsValid(valid);
    
    if (value && valid) {
      handleConvert();
    } else {
      setResult('');
      setSteps([]);
    }
  };

  const copyToClipboard = async () => {
    if (result) {
      await navigator.clipboard.writeText(result);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleClear = () => {
    setInputValue('');
    setResult('');
    setSteps([]);
    setIsValid(true);
  };

  const switchInputType = () => {
    setInputType(inputType === 'decimal' ? 'binary' : 'decimal');
    handleClear();
  };

  useEffect(() => {
    if (inputValue && isValid) {
      handleConvert();
    }
  }, [inputType]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-gray-900 to-black relative overflow-hidden">
      {/* Animated Background Effects */}
      <div className="fixed inset-0 opacity-30">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full mix-blend-multiply filter blur-3xl animate-float"></div>
        <div className="absolute top-3/4 right-1/4 w-96 h-96 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full mix-blend-multiply filter blur-3xl animate-float animation-delay-2000"></div>
        <div className="absolute bottom-1/4 left-1/2 w-96 h-96 bg-gradient-to-r from-green-500 to-teal-500 rounded-full mix-blend-multiply filter blur-3xl animate-float animation-delay-4000"></div>
        <div className="absolute top-1/2 left-1/3 w-64 h-64 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-full mix-blend-multiply filter blur-2xl animate-float animation-delay-6000"></div>
        <div className="absolute bottom-1/3 right-1/3 w-80 h-80 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full mix-blend-multiply filter blur-2xl animate-float animation-delay-8000"></div>
      </div>

      {/* Grid Pattern Overlay */}
      <div className="fixed inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: `
            linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)
          `,
          backgroundSize: '50px 50px'
        }}></div>
      </div>

      <div className="relative z-10 container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500 bg-clip-text text-transparent mb-4">
            Binary ↔ Decimal Converter
          </h1>
          <p className="text-gray-300 text-lg">
            Convert between binary and decimal with step-by-step calculations
          </p>
        </div>

        <div className="max-w-4xl mx-auto space-y-8">
          {/* Input Section */}
          <Card className="relative bg-gray-900/60 backdrop-blur-lg border-2 border-gray-700/50 transition-all duration-500 hover:scale-[1.02] group overflow-hidden">
            {/* Animated RGB Border */}
            <div className="absolute inset-0 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-500">
              <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-red-500 via-yellow-500 via-green-500 via-cyan-500 via-blue-500 via-purple-500 to-red-500 animate-spin-slow"></div>
              <div className="absolute inset-[2px] rounded-lg bg-gray-900/90 backdrop-blur-lg"></div>
            </div>
            
            {/* Glow Effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/20 via-purple-500/20 to-pink-500/20 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-xl"></div>
            
            {/* Corner Accents */}
            <div className="absolute top-0 left-0 w-20 h-20 bg-gradient-to-br from-cyan-400/30 to-transparent rounded-tl-lg opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-bl from-purple-400/30 to-transparent rounded-tr-lg opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <div className="absolute bottom-0 left-0 w-20 h-20 bg-gradient-to-tr from-pink-400/30 to-transparent rounded-bl-lg opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <div className="absolute bottom-0 right-0 w-20 h-20 bg-gradient-to-tl from-yellow-400/30 to-transparent rounded-br-lg opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            
            <CardHeader className="relative z-10">
              <CardTitle className="flex items-center gap-3 text-white">
                <Calculator className="h-6 w-6 text-cyan-400" />
                Input {inputType === 'decimal' ? 'Decimal' : 'Binary'} Number
              </CardTitle>
            </CardHeader>
            <CardContent className="relative z-10 space-y-4">
              <div className="flex gap-4 mb-4">
                <Button
                  onClick={switchInputType}
                  variant="outline"
                  className="relative flex items-center gap-2 bg-gray-800/60 border-gray-600 text-white transition-all duration-500 hover:scale-110 hover:shadow-2xl hover:shadow-cyan-500/60 group/btn overflow-hidden"
                >
                  {/* Animated RGB Border */}
                  <div className="absolute inset-0 rounded-md opacity-0 group-hover/btn:opacity-100 transition-opacity duration-500">
                    <div className="absolute inset-0 rounded-md bg-gradient-to-r from-red-500 via-yellow-500 via-green-500 via-cyan-500 via-blue-500 via-purple-500 to-red-500 animate-spin-slow"></div>
                    <div className="absolute inset-[2px] rounded-md bg-gray-800/95 backdrop-blur-sm"></div>
                  </div>
                  
                  {/* Pulsing Glow Effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/30 via-purple-500/30 to-pink-500/30 rounded-md opacity-0 group-hover/btn:opacity-100 transition-opacity duration-500 blur-lg animate-pulse"></div>
                  
                  {/* Corner Light Effects */}
                  <div className="absolute top-0 left-0 w-8 h-8 bg-gradient-to-br from-cyan-400/50 to-transparent rounded-tl-md opacity-0 group-hover/btn:opacity-100 transition-opacity duration-500"></div>
                  <div className="absolute top-0 right-0 w-8 h-8 bg-gradient-to-bl from-purple-400/50 to-transparent rounded-tr-md opacity-0 group-hover/btn:opacity-100 transition-opacity duration-500"></div>
                  <div className="absolute bottom-0 left-0 w-8 h-8 bg-gradient-to-tr from-pink-400/50 to-transparent rounded-bl-md opacity-0 group-hover/btn:opacity-100 transition-opacity duration-500"></div>
                  <div className="absolute bottom-0 right-0 w-8 h-8 bg-gradient-to-tl from-yellow-400/50 to-transparent rounded-br-md opacity-0 group-hover/btn:opacity-100 transition-opacity duration-500"></div>
                  
                  {/* Inner Glow */}
                  <div className="absolute inset-2 bg-gradient-to-r from-cyan-500/20 via-purple-500/20 to-pink-500/20 rounded opacity-0 group-hover/btn:opacity-100 transition-opacity duration-500"></div>
                  
                  <RotateCcw className="h-4 w-4" />
                  <span className="relative z-10">Switch to {inputType === 'decimal' ? 'Binary' : 'Decimal'}</span>
                </Button>
                <Badge 
                  variant="secondary" 
                  className="bg-gradient-to-r from-purple-500 to-cyan-500 text-white px-4 py-1"
                >
                  {inputType === 'decimal' ? 'Decimal Mode' : 'Binary Mode'}
                </Badge>
              </div>
              
              <div className="space-y-2">
                <Input
                  type="text"
                  value={inputValue}
                  onChange={(e) => handleInputChange(e.target.value)}
                  placeholder={`Enter ${inputType} number...`}
                  className={`text-lg p-4 bg-gray-800/60 border-2 text-white placeholder:text-gray-400 focus:ring-4 focus:ring-purple-500/50 transition-all duration-300 hover:bg-gray-700/60 hover:scale-[1.02] hover:shadow-lg hover:shadow-purple-500/30 ${
                    !isValid ? 'border-red-500 focus:border-red-500' : 'border-gray-600 focus:border-purple-500 hover:border-purple-400'
                  }`}
                />
                {!isValid && (
                  <p className="text-red-400 text-sm">
                    Please enter a valid {inputType} number
                  </p>
                )}
                {inputType === 'binary' && (
                  <p className="text-gray-400 text-sm">Only 0s and 1s allowed</p>
                )}
                {inputType === 'decimal' && (
                  <p className="text-gray-400 text-sm">Only positive integers allowed</p>
                )}
              </div>

              {result && (
                <div className="mt-6 p-4 bg-gradient-to-r from-gray-800/60 to-gray-700/60 rounded-lg border border-gray-600 hover:border-cyan-400/50 transition-all duration-300 hover:shadow-lg hover:shadow-cyan-500/30 hover:scale-[1.01] group/result">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-300 text-sm mb-1">
                        {inputType === 'decimal' ? 'Binary' : 'Decimal'} Result:
                      </p>
                      <p className="text-2xl font-mono font-bold text-cyan-400 break-all group-hover/result:text-cyan-300 transition-colors duration-300">
                        {result}
                      </p>
                    </div>
                    <Button
                      onClick={copyToClipboard}
                      variant="outline"
                      size="sm"
                      className="relative bg-gray-700/60 border-gray-500 text-white transition-all duration-300 hover:scale-110 hover:shadow-lg hover:shadow-green-500/50 group/copy overflow-hidden"
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-green-500 to-cyan-500 opacity-0 group-hover/copy:opacity-100 transition-opacity duration-300"></div>
                      <div className="absolute inset-[1px] bg-gray-700/90 rounded opacity-0 group-hover/copy:opacity-100 transition-opacity duration-300"></div>
                      <Copy className="h-4 w-4" />
                      <span className="relative z-10">{copied ? 'Copied!' : 'Copy'}</span>
                    </Button>
                  </div>
                </div>
              )}

              <Button
                onClick={handleClear}
                variant="outline"
                className="relative w-full bg-gray-800/60 border-gray-600 text-white transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:shadow-red-500/60 group/clear overflow-hidden"
              >
                {/* Animated RGB Border */}
                <div className="absolute inset-0 rounded-md opacity-0 group-hover/clear:opacity-100 transition-opacity duration-500">
                  <div className="absolute inset-0 rounded-md bg-gradient-to-r from-red-500 via-orange-500 via-yellow-500 via-green-500 via-blue-500 via-purple-500 to-red-500 animate-spin-slow"></div>
                  <div className="absolute inset-[2px] rounded-md bg-gray-800/95 backdrop-blur-sm"></div>
                </div>
                
                {/* Pulsing Glow Effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-red-500/30 via-orange-500/30 to-pink-500/30 rounded-md opacity-0 group-hover/clear:opacity-100 transition-opacity duration-500 blur-lg animate-pulse"></div>
                
                {/* Corner Light Effects */}
                <div className="absolute top-0 left-0 w-10 h-10 bg-gradient-to-br from-red-400/50 to-transparent rounded-tl-md opacity-0 group-hover/clear:opacity-100 transition-opacity duration-500"></div>
                <div className="absolute top-0 right-0 w-10 h-10 bg-gradient-to-bl from-orange-400/50 to-transparent rounded-tr-md opacity-0 group-hover/clear:opacity-100 transition-opacity duration-500"></div>
                <div className="absolute bottom-0 left-0 w-10 h-10 bg-gradient-to-tr from-pink-400/50 to-transparent rounded-bl-md opacity-0 group-hover/clear:opacity-100 transition-opacity duration-500"></div>
                <div className="absolute bottom-0 right-0 w-10 h-10 bg-gradient-to-tl from-yellow-400/50 to-transparent rounded-br-md opacity-0 group-hover/clear:opacity-100 transition-opacity duration-500"></div>
                
                {/* Inner Glow */}
                <div className="absolute inset-2 bg-gradient-to-r from-red-500/20 via-orange-500/20 to-pink-500/20 rounded opacity-0 group-hover/clear:opacity-100 transition-opacity duration-500"></div>
                
                {/* Ripple Effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-red-500/10 to-pink-500/10 rounded-md opacity-0 group-hover/clear:opacity-100 transition-opacity duration-300 animate-ping"></div>
                
                <span className="relative z-10">Clear All</span>
              </Button>
            </CardContent>
          </Card>

          {/* Step-by-step Calculation */}
          {steps.length > 0 && (
            <Card className="relative bg-gray-900/60 backdrop-blur-lg border-2 border-gray-700/50 transition-all duration-500 hover:scale-[1.01] group overflow-hidden">
              {/* Animated RGB Border */}
              <div className="absolute inset-0 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-blue-500 via-purple-500 via-pink-500 via-red-500 via-orange-500 via-yellow-500 to-blue-500 animate-spin-slow"></div>
                <div className="absolute inset-[2px] rounded-lg bg-gray-900/90 backdrop-blur-lg"></div>
              </div>
              
              {/* Glow Effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-pink-500/20 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-xl"></div>
              
              <CardHeader className="relative z-10">
                <CardTitle className="flex items-center gap-3 text-white">
                  <Zap className="h-6 w-6 text-yellow-400" />
                  Step-by-Step Calculation
                </CardTitle>
                <p className="text-gray-300">
                  {inputType === 'decimal' 
                    ? 'Converting decimal to binary by dividing by 2' 
                    : 'Converting binary to decimal using powers of 2'
                  }
                </p>
              </CardHeader>
              <CardContent className="relative z-10">
                <div className="space-y-3">
                  {steps.map((step, index) => (
                    <div 
                      key={index} 
                      className="relative flex items-center justify-between p-4 bg-gray-800/40 rounded-lg border border-gray-600/50 transition-all duration-300 hover:scale-[1.03] hover:shadow-lg hover:shadow-purple-500/30 group/step overflow-hidden"
                      style={{ animationDelay: `${index * 100}ms` }}
                    >
                      {/* Step Hover Effect */}
                      <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 via-cyan-500/20 to-pink-500/20 opacity-0 group-hover/step:opacity-100 transition-opacity duration-300 rounded-lg"></div>
                      <div className="absolute inset-0 border border-purple-500/30 opacity-0 group-hover/step:opacity-100 transition-opacity duration-300 rounded-lg"></div>
                      
                      <div className="flex items-center gap-4">
                        <Badge 
                          variant="outline" 
                          className="relative bg-gradient-to-r from-cyan-500 to-purple-500 text-white border-none group-hover/step:scale-110 group-hover/step:shadow-lg group-hover/step:shadow-cyan-500/50 transition-all duration-300 z-10"
                        >
                          Step {step.step}
                        </Badge>
                        <span className="relative font-mono text-white group-hover/step:text-cyan-300 transition-colors duration-300 z-10">
                          {step.calculation}
                        </span>
                      </div>
                      <span className="relative text-gray-300 font-medium group-hover/step:text-purple-300 transition-colors duration-300 z-10">
                        {step.result}
                      </span>
                    </div>
                  ))}
                  
                  {inputType === 'decimal' && (
                    <div className="relative mt-4 p-4 bg-gradient-to-r from-green-800/30 to-cyan-800/30 rounded-lg border border-green-500/50 hover:border-green-400/70 hover:shadow-lg hover:shadow-green-500/30 transition-all duration-300 group/final overflow-hidden">
                      <div className="absolute inset-0 bg-gradient-to-r from-green-500/10 to-cyan-500/10 opacity-0 group-hover/final:opacity-100 transition-opacity duration-300 rounded-lg"></div>
                      <p className="relative text-green-400 font-medium group-hover/final:text-green-300 transition-colors duration-300 z-10">
                        Final Binary: Read remainders from bottom to top → {result}
                      </p>
                    </div>
                  )}
                  
                  {inputType === 'binary' && (
                    <div className="relative mt-4 p-4 bg-gradient-to-r from-blue-800/30 to-purple-800/30 rounded-lg border border-blue-500/50 hover:border-blue-400/70 hover:shadow-lg hover:shadow-blue-500/30 transition-all duration-300 group/final overflow-hidden">
                      <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10 opacity-0 group-hover/final:opacity-100 transition-opacity duration-300 rounded-lg"></div>
                      <p className="relative text-blue-400 font-medium group-hover/final:text-blue-300 transition-colors duration-300 z-10">
                        Final Decimal: Sum of all calculations → {result}
                      </p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Information Card */}
          <Card className="relative bg-gray-900/40 backdrop-blur-lg border-2 border-gray-700/50 transition-all duration-500 hover:scale-[1.01] group overflow-hidden">
            {/* Animated RGB Border */}
            <div className="absolute inset-0 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-500">
              <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-green-500 via-cyan-500 via-blue-500 via-purple-500 via-pink-500 via-red-500 to-green-500 animate-spin-slow"></div>
              <div className="absolute inset-[2px] rounded-lg bg-gray-900/90 backdrop-blur-lg"></div>
            </div>
            
            {/* Glow Effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-green-500/20 via-cyan-500/20 to-purple-500/20 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-xl"></div>
            
            <CardContent className="p-6">
              <h3 className="relative text-xl font-bold text-white mb-4 group-hover:text-cyan-300 transition-colors duration-300 z-10">
                How It Works
              </h3>
              <div className="relative grid md:grid-cols-2 gap-6 text-gray-300 z-10">
                <div className="space-y-2">
                  <h4 className="font-semibold text-purple-400 group-hover:text-purple-300 transition-colors duration-300">Decimal to Binary:</h4>
                  <p className="text-sm group-hover:text-gray-200 transition-colors duration-300">Repeatedly divide by 2 and collect remainders from bottom to top.</p>
                </div>
                <div className="space-y-2">
                  <h4 className="font-semibold text-cyan-400 group-hover:text-cyan-300 transition-colors duration-300">Binary to Decimal:</h4>
                  <p className="text-sm group-hover:text-gray-200 transition-colors duration-300">Multiply each bit by its corresponding power of 2 and sum the results.</p>
                </div>
                <div className="space-y-2">
                  <h4 className="font-semibold text-cyan-400 group-hover:text-cyan-300 transition-colors duration-300">© 2025 TheCrickTech. All rights reserved. Developed and maintained by Mudit Bhatt.</h4>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <style jsx global>{`
        @keyframes spin-slow {
          0%, 100% {
            transform: rotate(0deg);
          }
          100% {
            transform: rotate(360deg);
          }
        }
        
        @keyframes float {
          0%, 100% {
            transform: translateY(0px) translateX(0px);
          }
          25% {
            transform: translateY(-20px) translateX(10px);
          }
          50% {
            transform: translateY(-10px) translateX(-10px);
          }
          75% {
            transform: translateY(-30px) translateX(5px);
          }
        }
        
        .animate-spin-slow {
          animation: spin-slow 8s linear infinite;
        }
        
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
        
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        
        .animation-delay-4000 {
          animation-delay: 4s;
        }
        
        .animation-delay-6000 {
          animation-delay: 6s;
        }
        
        .animation-delay-8000 {
          animation-delay: 8s;
        }
      `}</style>
    </div>
  );
}