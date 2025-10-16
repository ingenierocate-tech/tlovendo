import { useState } from 'react'
import { CalculatorIcon } from '@heroicons/react/24/outline'

interface FinanceCalculatorProps {
  price: number
}

export default function FinanceCalculator({ price }: FinanceCalculatorProps) {
  const [downPayment, setDownPayment] = useState(price * 0.2) // 20% por defecto
  const [months, setMonths] = useState(36)
  const [interestRate] = useState(0.12) // 12% anual

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-CL', {
      style: 'currency',
      currency: 'CLP',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount)
  }

  const calculateMonthlyPayment = () => {
    const loanAmount = price - downPayment
    const monthlyRate = interestRate / 12
    const monthlyPayment = (loanAmount * monthlyRate * Math.pow(1 + monthlyRate, months)) / 
                          (Math.pow(1 + monthlyRate, months) - 1)
    return monthlyPayment
  }

  const monthlyPayment = calculateMonthlyPayment()
  const totalAmount = downPayment + (monthlyPayment * months)
  const totalInterest = totalAmount - price

  const downPaymentPercentage = (downPayment / price) * 100

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6">
      <h3 className="text-lg font-bold text-gray-900 font-heading mb-6 flex items-center gap-2">
        <CalculatorIcon className="w-5 h-5 text-brand-red" />
        Calculadora de Financiamiento
      </h3>

      <div className="space-y-6">
        {/* Precio del vehículo */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Precio del vehículo
          </label>
          <div className="text-lg font-bold text-gray-900">
            {formatCurrency(price)}
          </div>
        </div>

        {/* Pie */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Pie ({downPaymentPercentage.toFixed(0)}%)
          </label>
          <input
            type="range"
            min={price * 0.1}
            max={price * 0.5}
            step={100000}
            value={downPayment}
            onChange={(e) => setDownPayment(Number(e.target.value))}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
          />
          <div className="flex justify-between text-xs text-gray-500 mt-1">
            <span>10%</span>
            <span className="font-medium text-gray-900">{formatCurrency(downPayment)}</span>
            <span>50%</span>
          </div>
        </div>

        {/* Plazo */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Plazo (meses)
          </label>
          <select
            value={months}
            onChange={(e) => setMonths(Number(e.target.value))}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-red focus:border-transparent"
          >
            <option value={12}>12 meses</option>
            <option value={24}>24 meses</option>
            <option value={36}>36 meses</option>
            <option value={48}>48 meses</option>
            <option value={60}>60 meses</option>
            <option value={72}>72 meses</option>
          </select>
        </div>

        {/* Resultados */}
        <div className="bg-gray-50 rounded-lg p-4 space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">Monto a financiar:</span>
            <span className="font-medium text-gray-900">
              {formatCurrency(price - downPayment)}
            </span>
          </div>
          
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">Cuota mensual:</span>
            <span className="text-lg font-bold text-brand-red">
              {formatCurrency(monthlyPayment)}
            </span>
          </div>
          
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">Total a pagar:</span>
            <span className="font-medium text-gray-900">
              {formatCurrency(totalAmount)}
            </span>
          </div>
          
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">Total intereses:</span>
            <span className="font-medium text-gray-900">
              {formatCurrency(totalInterest)}
            </span>
          </div>
        </div>

        {/* Disclaimer */}
        <div className="text-xs text-gray-500 bg-yellow-50 p-3 rounded-lg">
          <p className="font-medium mb-1">* Simulación referencial</p>
          <p>
            Los valores mostrados son referenciales y pueden variar según la evaluación crediticia, 
            tasa de interés vigente y condiciones del financiamiento. Consulta con nuestros ejecutivos 
            para obtener una cotización personalizada.
          </p>
        </div>

        {/* CTA */}
        <button className="w-full bg-brand-red text-white py-3 px-4 rounded-lg font-semibold hover:bg-red-700 transition-colors">
          Solicitar Financiamiento
        </button>
      </div>
    </div>
  )
}