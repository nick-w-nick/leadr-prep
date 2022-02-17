import { Router } from 'express';
const router = Router();

import { join, resolve } from 'path';
import jsonfile from 'jsonfile';

const employees = jsonfile.readFileSync(join(resolve(), 'static', 'employees.json'));

router.get('/:id?', async (req, res) => {
    
    const employeeId = req.params.id;
    
    if (employeeId) {
        const employee = employees.filter(employee => employee.id === employeeId);
        return res.send({
            status: 'success',
            data: employee
        });
    }
    
    try {
        const tree = employees.map(employee => {
            const { id, manager } = employee;
            const reports = employees.filter(person => person.manager === id);
            return {
                id,
                manager,
                reports
            };
        });
        
        return res.status(200).send({
            status: 'success',
            data: tree
        });
    } catch (error) {
        return res.status(500).send({
            status: 'error',
            data: error.message
        });
    }
});

router.post('/', (req, res) => {
    try {
        const { id, manager } = req.body;
        
        const employeeExists = employees.filter(employee => employee.id === id).length;
        
        if (employeeExists) {
            return res.status(400).send({
                status: 'error',
                data: 'employee already exists'
            });
        }
        
        const managerExists = employees.filter(employee => employee.id === manager).length;
        
        if (!managerExists) {
            return res.status(400).send({
                status: 'error',
                data: 'manager does not exist'
            });
        }
        
        const updatedEmployees = [ ...employees, { id, manager } ];
        jsonfile.writeFileSync(join(resolve(), 'static', 'employees.json'), updatedEmployees);
        
        return res.status(200).send(updatedEmployees);
    } catch (error) {
        return res.status(500).send({
            status: 'error',
            data: error.message
        });
    }
});

router.delete('/:id', (req, res) => {
    const { id } = req.params;
    
    try {
        const currentEmployee = employees.filter(employee => employee.id === id);
        
        if (currentEmployee.length === 0) {
            return res.status(400).send({
                status: 'error',
                data: 'employee does not exist'
            });
        }
        
        const { manager } = currentEmployee;
        
        const reports = employees.filter(employee => employee.manager === id);
        
        const reportIndexes = reports.map(report => {
            const { id } = report;
            
            const index = employees.findIndex(employee => employee.id === id);
            
            return {
                id,
                index
            };
        });
        
        reportIndexes.forEach(report => {
            const { index } = report;
            employees[index].manager = manager;
        });
        
        const removed = employees.filter(employee => employee.id !== id);
        
        jsonfile.writeFileSync(join(resolve(), 'static', 'employees.json'), removed);
        return res.send({
            status: 'success',
            data: removed
        });
    } catch (error) {
        return res.status(500).send({
            status: 'error',
            data: error.message
        });
    }
});

export default router;