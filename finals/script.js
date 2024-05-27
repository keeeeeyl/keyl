document.addEventListener('DOMContentLoaded', function() {
    fetchTasks();

    document.getElementById('todo-form').addEventListener('submit', function(e) {
        e.preventDefault();
        var taskInput = document.getElementById('task-input');
        
        if (taskInput.value.trim() !== '') {
            var formData = new FormData();
            formData.append('action', 'add');
            formData.append('text', taskInput.value);
            fetch('tasks.php', {
                method: 'POST',
                body: formData
            })
            .then(response => response.text())
            .then(data => {
                taskInput.value = '';
                fetchTasks(); 
            })
            .catch(error => console.error('Error:', error));
        }
    });

    document.getElementById('task-list').addEventListener('change', function(e) {
        if (e.target.tagName === 'INPUT' && e.target.type === 'checkbox') {
            var formData = new FormData();
            formData.append('action', 'check');
            formData.append('id', e.target.dataset.id);
            fetch('tasks.php', {
                method: 'POST',
                body: formData
            })
            .then(response => response.text())
            .then(data => {
                fetchTasks();
            })
            .catch(error => console.error('Error:', error));
        }
    });
});

function deleteTask(id) {
    var formData = new FormData();
    formData.append('action', 'delete');
    formData.append('id', id);
    fetch('tasks.php', {
        method: 'POST',
        body: formData
    })
    .then(response => response.text())
    .then(data => {
        fetchTasks();
    })
    .catch(error => console.error('Error:', error));
}

function editTask(id, newText) {
    var formData = new FormData();
    formData.append('action', 'edit');
    formData.append('id', id);
    formData.append('text', newText);
    fetch('tasks.php', {
        method: 'POST',
        body: formData
    })
    .then(response => response.text())
    .then(data => {
        fetchTasks(); 
    })
    .catch(error => console.error('Error:', error));
}

function fetchTasks() {
    fetch('tasks.php?action=fetch')
    .then(response => response.json())
    .then(data => {
        var taskList = document.getElementById('task-list');
        taskList.innerHTML = '';
        data.forEach(task => {
            var li = document.createElement('li');
            
            var checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.dataset.id = task.id;
            checkbox.checked = task.checked == 1;
            checkbox.classList.add('task-checkbox');  
            li.appendChild(checkbox);
            
            var span = document.createElement('span');
            span.textContent = task.task_name;
            if (task.checked == 1) {
                span.style.textDecoration = 'line-through'; 
                span.style.color = '#999'; 
            }
            li.appendChild(span);
            
            var buttonGroup = document.createElement('div');
            buttonGroup.classList.add('button-group');
            
            var editButton = document.createElement('button');
            editButton.innerHTML = '<img src="edit.png" alt="Edit" style="width:20px; height:20px">';
            editButton.onclick = function() { 
                var input = document.createElement('input');
                input.type = 'text';
                input.value = task.task_name;
                input.onblur = function() {
                    if (input.value.trim() !== '') {
                        editTask(task.id, input.value);
                    }
                };
                li.replaceChild(input, span);
                input.focus();
            };
            buttonGroup.appendChild(editButton);

            var deleteButton = document.createElement('button');
            deleteButton.innerHTML = '<img src="delete.png" alt="Delete" style="width:20px; height:20px">';
            deleteButton.onclick = function() { deleteTask(task.id); };
            buttonGroup.appendChild(deleteButton);
            
            li.appendChild(buttonGroup);
            taskList.appendChild(li);
        });
    })
    .catch(error => console.error('Error:', error));
}
