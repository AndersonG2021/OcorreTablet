document.addEventListener('DOMContentLoaded', () => {
    const employeeGrid = document.getElementById('employeeGrid');
    
    const fetchSetores = async () => {
        try {
            const response = await fetch('http://localhost:8080/setor/all');
            return await response.json();
        } catch (error) {
            console.error('Erro ao carregar setores:', error);
        }
    };

    const fetchEmpregados = async () => {
        try {
            const response = await fetch('http://localhost:8080/empregado/all');
            return await response.json();
        } catch (error) {
            console.error('Erro ao carregar empregados:', error);
        }
    };

    const createFalha = async (falha) => {
        try {
            const response = await fetch('http://localhost:8080/falhas/create', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(falha),
            });
            return await response.text();
        } catch (error) {
            console.error('Erro ao criar falha:', error);
        }
    };

    const renderDepartments = async () => {
        const departamentos = await fetchSetores();
        employeeGrid.innerHTML = '';
        departamentos.forEach(dept => {
            const btn = createButton(dept.setorNome, 'btn-primary redondo' , () => renderEmployees(dept.setorId));
            employeeGrid.appendChild(btn);
        });
    };

    const renderEmployees = async (deptId) => {
        const empregados = await fetchEmpregados();
        employeeGrid.innerHTML = '';
        empregados
            .filter(emp => emp.setor.setorId === deptId)
            .forEach(emp => {
                const btn = createButton(emp.nomeEmpregado, 'btn-success redondo', () => showFailureTypeModal(deptId, emp.idEmpregado));
                employeeGrid.appendChild(btn);
            });
        const backBtn = createButton('Voltar', 'btn-danger redondo', renderDepartments);
        employeeGrid.appendChild(backBtn);
    };

    const showFailureTypeModal = (deptId, empId) => {
        const modal = new bootstrap.Modal(document.getElementById('failureTypeModal'));
        const buttonContainer = document.getElementById('failureTypeButtons');
        buttonContainer.innerHTML = '';

        const failureTypes = ["Falha em equipamento", "Falta de insumo", "Assédio", "Falha de pessoal", "Acidente"];
        failureTypes.forEach(type => {
            const btn = createButton(type, 'btn-primary', () => reportIncident(type, deptId, empId));
            buttonContainer.appendChild(btn);
        });

        modal.show();
    };

    const reportIncident = async (tipoFalha, deptId, empId) => {
        const incidentData = {
            tipoFalha: tipoFalha,
            dataOcorrido: new Date().toISOString().split('T')[0], // Formato: YYYY-MM-DD
            setor: { setorId: deptId, setorNome: '' }, // Nome do setor pode ser carregado se necessário
        };
    
        const modal = bootstrap.Modal.getInstance(document.getElementById('failureTypeModal'));
    
        await createFalha(incidentData);
        alert('Incidente reportado com sucesso!');
    
        modal.hide();
        renderEmployees(deptId);
    };
    
    const createButton = (text, className, onClick) => {
        const btn = document.createElement('button');
        btn.className = `btn ${className} employee-button`;
        btn.textContent = text;
        btn.onclick = onClick;
        return btn;
    };

    renderDepartments();
});
