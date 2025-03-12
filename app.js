document.addEventListener('DOMContentLoaded', () => {
    const taskForm = document.getElementById('task-form');
    const newTaskInput = document.getElementById('new-task');
    const searchTaskInput = document.getElementById('search-task');
    const searchTaskIdInput = document.getElementById('search-task-id');
    const pendingTasksList = document.getElementById('pending-tasks');
    const completedTasksList = document.getElementById('completed-tasks');
  
    let tasks = [];
  
    // Cargar tareas iniciales desde la API JSONPlaceholder
    const loadTasks = async () => {
      try {
        const response = await fetch('https://jsonplaceholder.typicode.com/todos');
        const data = await response.json();
        tasks = data; // Asignar las tareas cargadas al arreglo `tasks`
        renderTasks();
      } catch (error) {
        console.error('Error cargando las tareas:', error);
      }
    };
  
    // Guardar tareas en localStorage
    const saveTasks = () => {
      localStorage.setItem('tasks', JSON.stringify(tasks));
    };
  
    // Obtener el último ID de las tareas
    const getLastId = () => {
      if (tasks.length === 0) return 0; // Si no hay tareas, el último ID es 0
      return Math.max(...tasks.map(task => task.id)); // Obtener el máximo ID
    };
  
    // Renderizar tareas en la interfaz
    const renderTasks = (filteredTasks = tasks) => {
      pendingTasksList.innerHTML = '';
      completedTasksList.innerHTML = '';
  
      filteredTasks.forEach(task => {
        const li = document.createElement('li');
        li.textContent = `ID: ${task.id} - ${task.title}`; // Mostrar el ID junto al título
        if (task.completed) {
          li.classList.add('completed');
        }
  
        // Contenedor para los botones
        const buttonsDiv = document.createElement('div');
        buttonsDiv.classList.add('task-buttons');
  
        // Botón para cambiar el estado de la tarea
        const toggleButton = document.createElement('button');
        toggleButton.textContent = task.completed ? 'Pendiente' : 'Completada';
        toggleButton.classList.add('complete-button');
        toggleButton.addEventListener('click', () => toggleTaskStatus(task.id));
  
        // Botón para editar la tarea
        const editButton = document.createElement('button');
        editButton.textContent = 'Editar';
        editButton.classList.add('edit-button');
        editButton.addEventListener('click', () => editTask(task.id));
  
        // Botón para eliminar la tarea
        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'Borrar';
        deleteButton.classList.add('delete-button');
        deleteButton.addEventListener('click', () => deleteTask(task.id));
  
        // Agregar botones al contenedor
        buttonsDiv.appendChild(toggleButton);
        buttonsDiv.appendChild(editButton);
        buttonsDiv.appendChild(deleteButton);
  
        // Agregar el contenedor de botones debajo del nombre de la tarea
        li.appendChild(buttonsDiv);
  
        if (task.completed) {
          completedTasksList.appendChild(li);
        } else {
          pendingTasksList.appendChild(li);
        }
      });
    };
  
    // Agregar una nueva tarea
    taskForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const title = newTaskInput.value.trim();
      if (title === '') return;
  
      const newTask = {
        id: getLastId() + 1, // Asignar el último ID + 1
        title,
        completed: false,
      };
  
      tasks.push(newTask);
      saveTasks();
      renderTasks();
      newTaskInput.value = '';
      alert('Tarea añadida correctamente.');
    });
  
    // Cambiar el estado de una tarea (completada/pendiente)
    const toggleTaskStatus = (id) => {
      tasks = tasks.map(task =>
        task.id === id ? { ...task, completed: !task.completed } : task
      );
      saveTasks();
      renderTasks();
    };
  
    // Editar una tarea
    const editTask = (id) => {
      const task = tasks.find(task => task.id === id);
      const newTitle = prompt('Editar tarea:', task.title);
      if (newTitle !== null && newTitle.trim() !== '') {
        task.title = newTitle.trim();
        saveTasks();
        renderTasks();
        alert('Tarea editada correctamente.');
      }
    };
  
    // Eliminar una tarea
    const deleteTask = (id) => {
      tasks = tasks.filter(task => task.id !== id);
      saveTasks();
      renderTasks();
      alert('Tarea eliminada correctamente.');
    };
  
    // Buscar tareas por título
    searchTaskInput.addEventListener('input', () => {
      const searchTerm = searchTaskInput.value.trim().toLowerCase();
      const filteredTasks = tasks.filter(task =>
        task.title.toLowerCase().includes(searchTerm)
      );
      renderTasks(filteredTasks);
    });
  
    // Buscar tareas por ID
    searchTaskIdInput.addEventListener('input', () => {
      const searchId = parseInt(searchTaskIdInput.value.trim());
      if (isNaN(searchId)) {
        renderTasks(); // Si no es un número, mostrar todas las tareas
        return;
      }
      const filteredTasks = tasks.filter(task => task.id === searchId);
      renderTasks(filteredTasks);
    });
  
    // Cargar tareas al iniciar la aplicación
    loadTasks();
  });