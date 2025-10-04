// Validador de datos para la base de datos
// Usar antes de hacer INSERTs para evitar errores

class DatabaseValidator {
  static validateUser(data) {
    const required = ['id', 'email', 'name', 'password'];
    const missing = required.filter(field => !data[field]);
    
    if (missing.length > 0) {
      throw new Error(`User validation failed. Missing fields: ${missing.join(', ')}`);
    }
    
    // Validar email único
    if (!data.email.includes('@')) {
      throw new Error('User email must be valid email address');
    }
    
    // Validar role
    const validRoles = ['admin', 'user', 'viewer'];
    if (data.role && !validRoles.includes(data.role)) {
      throw new Error(`User role must be one of: ${validRoles.join(', ')}`);
    }
    
    return true;
  }

  static validateClient(data) {
    const required = ['id', 'name'];
    const missing = required.filter(field => !data[field]);
    
    if (missing.length > 0) {
      throw new Error(`Client validation failed. Missing fields: ${missing.join(', ')}`);
    }
    
    return true;
  }

  static validateContract(data) {
    const required = ['id', 'name', 'startDate', 'endDate', 'value', 'clientId', 'userId'];
    const missing = required.filter(field => !data[field]);
    
    if (missing.length > 0) {
      throw new Error(`Contract validation failed. Missing fields: ${missing.join(', ')}`);
    }
    
    // Validar fechas
    const startDate = new Date(data.startDate);
    const endDate = new Date(data.endDate);
    
    if (endDate <= startDate) {
      throw new Error('Contract endDate must be after startDate');
    }
    
    // Validar status
    const validStatus = ['active', 'completed', 'cancelled', 'suspended'];
    if (data.status && !validStatus.includes(data.status)) {
      throw new Error(`Contract status must be one of: ${validStatus.join(', ')}`);
    }
    
    // Validar contractType
    const validTypes = ['drilling', 'completion', 'workover'];
    if (data.contractType && !validTypes.includes(data.contractType)) {
      throw new Error(`Contract type must be one of: ${validTypes.join(', ')}`);
    }
    
    return true;
  }

  static validateField(data) {
    const required = ['id', 'name', 'location', 'contractId'];
    const missing = required.filter(field => !data[field]);
    
    if (missing.length > 0) {
      throw new Error(`Field validation failed. Missing fields: ${missing.join(', ')}`);
    }
    
    return true;
  }

  static validateWell(data) {
    const required = ['id', 'name', 'location', 'userId'];
    const missing = required.filter(field => !data[field]);
    
    if (missing.length > 0) {
      throw new Error(`Well validation failed. Missing fields: ${missing.join(', ')}`);
    }
    
    // Validar wellType
    const validTypes = ['vertical', 'horizontal', 'direccional'];
    if (data.wellType && !validTypes.includes(data.wellType)) {
      throw new Error(`Well type must be one of: ${validTypes.join(', ')}`);
    }
    
    // Validar operation
    const validOperations = ['drilling', 'completion', 'testing', 'production'];
    if (data.operation && !validOperations.includes(data.operation)) {
      throw new Error(`Well operation must be one of: ${validOperations.join(', ')}`);
    }
    
    return true;
  }

  static validateDrillingPlan(data) {
    const required = ['wellId', 'day', 'depthFrom', 'depthTo', 'plannedROP', 'plannedHours'];
    const missing = required.filter(field => !data[field]);
    
    if (missing.length > 0) {
      throw new Error(`DrillingPlan validation failed. Missing fields: ${missing.join(', ')}`);
    }
    
    // Validar day > 0
    if (data.day <= 0) {
      throw new Error('DrillingPlan day must be greater than 0');
    }
    
    // Validar depthTo > depthFrom
    if (data.depthTo <= data.depthFrom) {
      throw new Error('DrillingPlan depthTo must be greater than depthFrom');
    }
    
    // Validar valores positivos
    if (data.plannedROP <= 0 || data.plannedHours <= 0) {
      throw new Error('DrillingPlan plannedROP and plannedHours must be positive numbers');
    }
    
    return true;
  }

  static validateDrillingData(data) {
    const required = ['wellId', 'day', 'date', 'depth'];
    const missing = required.filter(field => !data[field]);
    
    if (missing.length > 0) {
      throw new Error(`DrillingData validation failed. Missing fields: ${missing.join(', ')}`);
    }
    
    // Validar day > 0
    if (data.day <= 0) {
      throw new Error('DrillingData day must be greater than 0');
    }
    
    // Validar depth >= 0
    if (data.depth < 0) {
      throw new Error('DrillingData depth must be non-negative');
    }
    
    // Validar status
    const validStatus = ['drilling', 'tripping', 'maintenance', 'waiting'];
    if (data.status && !validStatus.includes(data.status)) {
      throw new Error(`DrillingData status must be one of: ${validStatus.join(', ')}`);
    }
    
    // Validar shift
    const validShifts = ['day', 'night'];
    if (data.shift && !validShifts.includes(data.shift)) {
      throw new Error(`DrillingData shift must be one of: ${validShifts.join(', ')}`);
    }
    
    return true;
  }

  // Validar orden de inserción
  static validateInsertOrder(tableName, existingData) {
    const dependencies = {
      'User': [],
      'Client': [],
      'Contract': ['User', 'Client'],
      'Field': ['Contract'],
      'Well': ['User', 'Field'],
      'DrillingPlan': ['Well'],
      'DrillingData': ['Well'],
      'ProductionData': ['Well'],
      'ContractActivity': ['Contract'],
      'Report': ['User']
    };

    const required = dependencies[tableName] || [];
    const missing = required.filter(dep => !existingData[dep]);

    if (missing.length > 0) {
      throw new Error(`Cannot insert ${tableName}. Missing dependencies: ${missing.join(', ')}`);
    }

    return true;
  }

  // Generar SQL con validación
  static generateValidatedInsert(tableName, data) {
    // Validar según la tabla
    switch(tableName) {
      case 'User':
        this.validateUser(data);
        break;
      case 'Client':
        this.validateClient(data);
        break;
      case 'Contract':
        this.validateContract(data);
        break;
      case 'Field':
        this.validateField(data);
        break;
      case 'Well':
        this.validateWell(data);
        break;
      case 'DrillingPlan':
        this.validateDrillingPlan(data);
        break;
      case 'DrillingData':
        this.validateDrillingData(data);
        break;
    }

    // Generar SQL
    const fields = Object.keys(data).map(key => `"${key}"`).join(', ');
    const values = Object.values(data).map(value => {
      if (typeof value === 'string') {
        return `'${value.replace(/'/g, "''")}'`;
      }
      return value;
    }).join(', ');

    return `INSERT INTO "${tableName}" (${fields}) VALUES (${values});`;
  }
}

// Ejemplo de uso:
/*
try {
  const userData = {
    id: 'admin123',
    email: 'admin@wellwizards.com',
    name: 'Administrador',
    password: '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi'
  };
  
  const sql = DatabaseValidator.generateValidatedInsert('User', userData);
  console.log(sql);
} catch (error) {
  console.error('Validation error:', error.message);
}
*/

module.exports = DatabaseValidator;