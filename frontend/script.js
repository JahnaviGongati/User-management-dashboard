const API = "https://user-management-dashboard-fwv4.onrender.com/users";

const table = document.getElementById("userTable");
const total = document.getElementById("totalUsers");
const modal = document.getElementById("modal");
const form = document.getElementById("userForm");
const message = document.getElementById("message");

let users = [];

// ===============================
// LOAD USERS
// ===============================

async function loadUsers() {
  try {
    const response = await fetch(API);

    if (!response.ok) {
      throw new Error("Could not load users");
    }

    users = await response.json();

    displayUsers(users);
  } catch (error) {
    console.error(error);
    message.textContent =
      "Cannot connect to backend. Make sure the server is running.";
  }
}

// ===============================
// DISPLAY USERS
// ===============================

function displayUsers(list) {
  table.innerHTML = "";

  total.textContent = users.length;

  list.forEach(user => {
    const tr = document.createElement("tr");

    const name = document.createElement("td");
    name.textContent = user.name;

    const email = document.createElement("td");
    email.textContent = user.email;

    const role = document.createElement("td");
    role.textContent = user.role;

    const actions = document.createElement("td");

    // Edit button
    const edit = document.createElement("button");

    edit.textContent = "Edit";
    edit.className = "action-btn";

    edit.addEventListener("click", () => {
      editUser(user);
    });

    // Delete button
    const del = document.createElement("button");

    del.textContent = "Delete";
    del.className = "action-btn delete";

    del.addEventListener("click", () => {
      deleteUser(user._id);
    });

    actions.append(edit, del);

    tr.append(name, email, role, actions);

    table.appendChild(tr);
  });
}

// ===============================
// OPEN ADD USER FORM
// ===============================

document.getElementById("addBtn").addEventListener("click", () => {
  form.reset();

  document.getElementById("userId").value = "";

  document.getElementById("formTitle").textContent = "Add User";

  modal.classList.remove("hidden");
});

// ===============================
// CLOSE FORM
// ===============================

document.getElementById("cancelBtn").addEventListener("click", () => {
  modal.classList.add("hidden");
});

// ===============================
// EDIT USER
// ===============================

function editUser(user) {
  document.getElementById("userId").value = user._id;

  document.getElementById("name").value = user.name;

  document.getElementById("email").value = user.email;

  document.getElementById("role").value = user.role;

  document.getElementById("formTitle").textContent = "Edit User";

  modal.classList.remove("hidden");
}

// ===============================
// ADD / UPDATE USER
// ===============================

form.addEventListener("submit", async event => {
  event.preventDefault();

  const id = document.getElementById("userId").value;

  const user = {
    name: document.getElementById("name").value.trim(),
    email: document.getElementById("email").value.trim(),
    role: document.getElementById("role").value
  };

  try {
    const response = await fetch(
      id ? `${API}/${id}` : API,
      {
        method: id ? "PUT" : "POST",

        headers: {
          "Content-Type": "application/json"
        },

        body: JSON.stringify(user)
      }
    );

    if (!response.ok) {
      throw new Error("Could not save user");
    }

    modal.classList.add("hidden");

    await loadUsers();

  } catch (error) {
    console.error(error);

    message.textContent = error.message;
  }
});

// ===============================
// DELETE USER
// ===============================

async function deleteUser(id) {
  if (!confirm("Delete this user?")) {
    return;
  }

  try {
    const response = await fetch(`${API}/${id}`, {
      method: "DELETE"
    });

    if (!response.ok) {
      throw new Error("Could not delete user");
    }

    await loadUsers();

  } catch (error) {
    console.error(error);

    message.textContent = error.message;
  }
}

// ===============================
// SEARCH USERS
// ===============================

document.getElementById("search").addEventListener("input", event => {
  const query = event.target.value.toLowerCase();

  const filtered = users.filter(user =>
    user.name.toLowerCase().includes(query) ||
    user.email.toLowerCase().includes(query) ||
    user.role.toLowerCase().includes(query)
  );

  displayUsers(filtered);
});

// ===============================
// START APPLICATION
// ===============================

loadUsers();