'use client'

import { useState, useEffect } from 'react'
import * as XLSX from 'xlsx'

interface ReportsProps {
  className?: string
}

interface FilterOptions {
  client: string
  field: string
  formation: string
  operation: string
  dateFrom: string
  dateTo: string
  wells: string[]
  contracts: string[]
  formations: string[]
  operations: string[]
}

interface WellData {
  id: string
  name: string
  status: string
  formation?: string
  operation?: string
  ropAverage?: number
  finalDepth?: number
  elapsedDays?: number
  field?: {
    name: string
    contract: {
      name: string
    }
  }
}

interface ContractData {
  id: string
  contractName: string
  client: string
  budgetAFE?: number
  actualCost?: number
  status: string
}

interface ReportData {
  wells: WellData[]
  contracts: ContractData[]
}

export function ReportsSystem({ className }: ReportsProps) {
  const [loading, setLoading] = useState(false)
  const [wells, setWells] = useState<WellData[]>([])
  const [reportData, setReportData] = useState<ReportData>({ wells: [], contracts: [] })
  
  const [filters, setFilters] = useState<FilterOptions>({
    client: '',
    field: '',
    formation: '',
    operation: '',
    dateFrom: '2024-01-01',
    dateTo: '2024-12-31',
    wells: [],
    contracts: [],
    formations: [],
    operations: []
  })

  // Available filter options
  const availableClients = ['Ecopetrol', 'Petrobras', 'Gran Tierra Energy', 'Shell', 'Chevron']
  const availableFields = ['Campo Casanare Norte', 'Campo Llanos', 'Campo Magdalena', 'Campo Putumayo']
  const availableFormations = ['La Luna', 'Guadalupe', 'Barco', 'Mirador', 'Carbonera']
  const availableOperations = ['drilling', 'completion', 'workover', 'maintenance', 'testing']

  useEffect(() => {
    fetchWellsData()
  }, [])

  const fetchWellsData = async () => {
    try {
      const response = await fetch('/api/wells')
      const data = await response.json()
      setWells(data)
      setReportData(prev => ({ ...prev, wells: data }))
    } catch (error) {
      console.error('Error fetching wells data:', error)
    }
  }

  const getFilteredWells = (): WellData[] => {
    let filtered = wells

    if (filters.client) {
      filtered = filtered.filter(well => 
        well.field?.contract.name.toLowerCase().includes(filters.client.toLowerCase())
      )
    }

    if (filters.field) {
      filtered = filtered.filter(well => 
        well.field?.name.toLowerCase().includes(filters.field.toLowerCase())
      )
    }

    if (filters.formation) {
      filtered = filtered.filter(well => 
        well.formation?.toLowerCase().includes(filters.formation.toLowerCase())
      )
    }

    if (filters.formations.length > 0) {
      filtered = filtered.filter(well => 
        well.formation && filters.formations.includes(well.formation)
      )
    }

    if (filters.operations.length > 0) {
      filtered = filtered.filter(well => 
        well.operation && filters.operations.includes(well.operation)
      )
    }

    return filtered
  }

  const generatePDFReport = async () => {
    setLoading(true)
    try {
      const filteredWells = getFilteredWells()
      
      // Create a printable version using browser's native print functionality
      const printWindow = window.open('', '_blank')
      if (!printWindow) {
        alert('Please allow popups to generate PDF reports')
        setLoading(false)
        return
      }

      const printHTML = `
        <!DOCTYPE html>
        <html>
        <head>
          <title>Well Wizards - Performance Report</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 20px; line-height: 1.6; }
            .header { text-align: center; color: #2563eb; margin-bottom: 30px; }
            .info { margin-bottom: 20px; }
            .summary { background: #f8f9fa; padding: 15px; border-radius: 8px; margin: 20px 0; }
            table { width: 100%; border-collapse: collapse; margin: 20px 0; }
            th, td { border: 1px solid #ddd; padding: 8px; text-align: left; font-size: 12px; }
            th { background-color: #2563eb; color: white; }
            tr:nth-child(even) { background-color: #f8f9fa; }
            .insights { margin: 20px 0; }
            .insights ul { margin: 0; padding-left: 20px; }
            .insights li { margin: 10px 0; }
            @media print {
              .no-print { display: none; }
              body { margin: 0; }
              .header h1 { font-size: 24px; }
              table { page-break-inside: avoid; }
            }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>Well Wizards - Performance Report</h1>
            <p><strong>Generated on:</strong> ${new Date().toLocaleDateString()}</p>
            <p><strong>Period:</strong> ${filters.dateFrom} to ${filters.dateTo}</p>
            <p><strong>Wells analyzed:</strong> ${filteredWells.length}</p>
          </div>

          <div class="summary">
            <h2>Executive Summary</h2>
            <p><strong>Average ROP:</strong> ${(filteredWells.reduce((sum, well) => sum + (well.ropAverage || 0), 0) / filteredWells.length).toFixed(1)} m/hr</p>
            <p><strong>Total Depth Drilled:</strong> ${filteredWells.reduce((sum, well) => sum + (well.finalDepth || 0), 0).toFixed(0)} m</p>
            <p><strong>Average Drilling Time:</strong> ${(filteredWells.reduce((sum, well) => sum + (well.elapsedDays || 0), 0) / filteredWells.length).toFixed(0)} days</p>
          </div>

          <h2>Wells Performance Data</h2>
          <table>
            <thead>
              <tr>
                <th>Well Name</th>
                <th>Formation</th>
                <th>Operation</th>
                <th>Status</th>
                <th>ROP (m/hr)</th>
                <th>Depth (m)</th>
                <th>Days</th>
                <th>Contract</th>
              </tr>
            </thead>
            <tbody>
              ${filteredWells.map(well => `
                <tr>
                  <td>${well.name}</td>
                  <td>${well.formation || 'N/A'}</td>
                  <td>${well.operation || 'N/A'}</td>
                  <td>${well.status}</td>
                  <td>${(well.ropAverage || 0).toFixed(1)}</td>
                  <td>${(well.finalDepth || 0).toFixed(0)}</td>
                  <td>${well.elapsedDays || 0}</td>
                  <td>${well.field?.contract.name || 'N/A'}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>

          <div class="insights">
            <h2>Performance Insights</h2>
            <ul>
              <li><strong>Best performing well:</strong> ${filteredWells.reduce((best, well) => 
                (well.ropAverage || 0) > (best.ropAverage || 0) ? well : best, 
                filteredWells[0] || { name: 'N/A', ropAverage: 0 }
              ).name} (${(filteredWells.reduce((best, well) => 
                (well.ropAverage || 0) > (best.ropAverage || 0) ? well : best, 
                filteredWells[0] || { name: 'N/A', ropAverage: 0 }
              ).ropAverage || 0).toFixed(1)} m/hr)</li>
              <li><strong>Wells above target (15 m/hr):</strong> ${filteredWells.filter(w => (w.ropAverage || 0) > 15).length}</li>
              <li><strong>Wells requiring attention:</strong> ${filteredWells.filter(w => (w.ropAverage || 0) < 12).length}</li>
            </ul>
          </div>

          <div class="no-print" style="text-align: center; margin: 30px 0;">
            <button onclick="window.print()" style="background: #2563eb; color: white; padding: 12px 24px; border: none; border-radius: 6px; cursor: pointer; font-size: 16px; margin-right: 10px;">
              📄 Print/Save as PDF
            </button>
            <button onclick="window.close()" style="background: #6b7280; color: white; padding: 12px 24px; border: none; border-radius: 6px; cursor: pointer; font-size: 16px;">
              ✖ Close
            </button>
          </div>
        </body>
        </html>
      `

      printWindow.document.write(printHTML)
      printWindow.document.close()
      
      // Auto-trigger print dialog after content loads
      setTimeout(() => {
        printWindow.print()
      }, 1000)

    } catch (error) {
      console.error('Error generating PDF:', error)
      alert('Error generating PDF report')
    } finally {
      setLoading(false)
    }
  }

  const generateExcelReport = () => {
    setLoading(true)
    try {
      const filteredWells = getFilteredWells()
      
      // Create workbook with multiple sheets
      const workbook = XLSX.utils.book_new()

      // Sheet 1: Wells Summary
      const summaryData = filteredWells.map((well: WellData) => ({
        'Well Name': well.name,
        'Field': well.field?.name || 'N/A',
        'Contract': well.field?.contract.name || 'N/A',
        'Formation': well.formation || 'N/A',
        'Operation': well.operation || 'N/A',
        'Status': well.status,
        'ROP Average (m/hr)': (well.ropAverage || 0).toFixed(1),
        'Final Depth (m)': (well.finalDepth || 0).toFixed(0),
        'Elapsed Days': well.elapsedDays || 0
      }))

      const summarySheet = XLSX.utils.json_to_sheet(summaryData)
      XLSX.utils.book_append_sheet(workbook, summarySheet, 'Wells Summary')

      // Sheet 2: Performance Metrics
      const metricsData = [
        { Metric: 'Total Wells', Value: filteredWells.length },
        { Metric: 'Active Wells', Value: filteredWells.filter((w: WellData) => w.status === 'active').length },
        { Metric: 'Completed Wells', Value: filteredWells.filter((w: WellData) => w.status === 'completed').length },
        { Metric: 'Average ROP (m/hr)', Value: (filteredWells.reduce((s: number, w: WellData) => s + (w.ropAverage || 0), 0) / filteredWells.length).toFixed(1) },
        { Metric: 'Total Depth Drilled (m)', Value: filteredWells.reduce((s: number, w: WellData) => s + (w.finalDepth || 0), 0).toFixed(0) },
        { Metric: 'Average Days per Well', Value: (filteredWells.reduce((s: number, w: WellData) => s + (w.elapsedDays || 0), 0) / filteredWells.length).toFixed(0) },
        { Metric: 'Wells Above Target (>15 m/hr)', Value: filteredWells.filter((w: WellData) => (w.ropAverage || 0) > 15).length },
        { Metric: 'Wells Below Target (<12 m/hr)', Value: filteredWells.filter((w: WellData) => (w.ropAverage || 0) < 12).length }
      ]

      const metricsSheet = XLSX.utils.json_to_sheet(metricsData)
      XLSX.utils.book_append_sheet(workbook, metricsSheet, 'Performance Metrics')

      // Sheet 3: Formation Analysis
      const formations = Array.from(new Set(filteredWells.map((w: WellData) => w.formation).filter(Boolean))) as string[]
      const formationStats = formations.map((formation: string) => {
        const formationWells = filteredWells.filter((w: WellData) => w.formation === formation)
        return {
          Formation: formation,
          'Well Count': formationWells.length,
          'Average ROP (m/hr)': formationWells.length > 0
            ? (formationWells.reduce((s: number, w: WellData) => s + (w.ropAverage || 0), 0) / formationWells.length).toFixed(1)
            : 'N/A',
          'Total Depth (m)': formationWells.length > 0
            ? (formationWells.reduce((s: number, w: WellData) => s + (w.finalDepth || 0), 0) / formationWells.length).toFixed(0)
            : 'N/A'
        }
      }).filter(f => f['Well Count'] > 0)

      const formationSheet = XLSX.utils.json_to_sheet(formationStats)
      XLSX.utils.book_append_sheet(workbook, formationSheet, 'Formation Analysis')

      // Save Excel file
      XLSX.writeFile(workbook, `well-wizards-detailed-report-${new Date().toISOString().split('T')[0]}.xlsx`)
    } catch (error) {
      console.error('Error generating Excel:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleFilterChange = (key: keyof FilterOptions, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value }))
  }

  const toggleArrayFilter = (key: 'wells' | 'contracts' | 'formations' | 'operations', value: string) => {
    setFilters(prev => ({
      ...prev,
      [key]: prev[key].includes(value)
        ? prev[key].filter(item => item !== value)
        : [...prev[key], value]
    }))
  }

  const filteredWells = getFilteredWells()

  return (
    <div className={`space-y-6 ${className}`}>
      <div className="bg-white rounded-lg border p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Advanced Reports System</h2>
          <div className="flex space-x-3">
            <button
              onClick={generatePDFReport}
              disabled={loading}
              className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 disabled:opacity-50 flex items-center space-x-2"
            >
              <span>📄</span>
              <span>{loading ? 'Generating...' : 'Generate PDF'}</span>
            </button>
            <button
              onClick={generateExcelReport}
              disabled={loading}
              className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 disabled:opacity-50 flex items-center space-x-2"
            >
              <span>📊</span>
              <span>{loading ? 'Generating...' : 'Generate Excel'}</span>
            </button>
          </div>
        </div>

        {/* Filters Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Client</label>
            <select
              value={filters.client}
              onChange={(e) => handleFilterChange('client', e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
            >
              <option value="">All Clients</option>
              {availableClients.map(client => (
                <option key={client} value={client}>{client}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Field</label>
            <select
              value={filters.field}
              onChange={(e) => handleFilterChange('field', e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
            >
              <option value="">All Fields</option>
              {availableFields.map(field => (
                <option key={field} value={field}>{field}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Formation</label>
            <select
              value={filters.formation}
              onChange={(e) => handleFilterChange('formation', e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
            >
              <option value="">All Formations</option>
              {availableFormations.map(formation => (
                <option key={formation} value={formation}>{formation}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Operation</label>
            <select
              value={filters.operation}
              onChange={(e) => handleFilterChange('operation', e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
            >
              <option value="">All Operations</option>
              {availableOperations.map(operation => (
                <option key={operation} value={operation}>{operation}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Date From</label>
            <input
              type="date"
              value={filters.dateFrom}
              onChange={(e) => handleFilterChange('dateFrom', e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Date To</label>
            <input
              type="date"
              value={filters.dateTo}
              onChange={(e) => handleFilterChange('dateTo', e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
            />
          </div>
        </div>

        {/* Data Preview */}
        <div className="border-t pt-6">
          <h3 className="text-lg font-semibold mb-4">Report Preview</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">{filteredWells.length}</div>
              <div className="text-sm text-blue-600">Wells Found</div>
            </div>
            <div className="bg-green-50 p-4 rounded-lg">
              <div className="text-2xl font-bold text-green-600">
                {(filteredWells.reduce((sum, well) => sum + (well.ropAverage || 0), 0) / filteredWells.length || 0).toFixed(1)}
              </div>
              <div className="text-sm text-green-600">Average ROP (m/hr)</div>
            </div>
            <div className="bg-purple-50 p-4 rounded-lg">
              <div className="text-2xl font-bold text-purple-600">
                {filteredWells.reduce((sum, well) => sum + (well.finalDepth || 0), 0).toFixed(0)}
              </div>
              <div className="text-sm text-purple-600">Total Depth (m)</div>
            </div>
          </div>

          {filteredWells.length > 0 && (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Well Name</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Formation</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Operation</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">ROP</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredWells.slice(0, 5).map(well => (
                    <tr key={well.id}>
                      <td className="px-4 py-2 text-sm text-gray-900">{well.name}</td>
                      <td className="px-4 py-2 text-sm text-gray-600">{well.formation || 'N/A'}</td>
                      <td className="px-4 py-2 text-sm text-gray-600 capitalize">{well.operation || 'N/A'}</td>
                      <td className="px-4 py-2 text-sm text-gray-900">{(well.ropAverage || 0).toFixed(1)}</td>
                      <td className="px-4 py-2 text-sm">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          well.status === 'active' ? 'bg-green-100 text-green-800' :
                          well.status === 'completed' ? 'bg-blue-100 text-blue-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {well.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {filteredWells.length > 5 && (
                <p className="text-sm text-gray-500 mt-2 text-center">
                  ... and {filteredWells.length - 5} more wells
                </p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}