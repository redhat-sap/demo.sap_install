var currentTab = 0; // Current tab is set to be the first tab (0)
var formdata = {
  token: "",
  controller_instance_name: "",
  controller_admin_password: "",
  rhaap_manifest: "",
  rhsm_username: "",
  rhsm_password: "",
  rhsm_poolid: "",
  controller_ah_enable: "",
  controller_ah_instance_name: "",
  automation_hub_server_url: "",
  quay_registry_username: "",
  quay_registry_password: "",
  rhsm_ah_offline_token: "",
  controller_eda_enable: "",
  controller_eda_instance_name: "",
  letsencrypt_skip: "",
  type: "",
  dns_update: "",
  dns_suffix: "",
  dns_key: "",
  dns_private: "",
  controller_ansible_private_key: "",
  controller_ansible_public_key: "",
  type: "",
  azure_location: "",
  instance_flavor: "",
  azure_resource_group: "",
  azure_private_network: "",
  azure_ssh_public_key: "",
};

function initTabs() {
  showTab(currentTab); // Display the current tab
}

function showTab(n) {
  // This function will display the specified tab of the form...
  var x = document.getElementsByClassName("formtab");
  x[n].style.display = "block";
  //... and fix the Previous/Next buttons:
  if (n == 0) {
    document.getElementById("prevBtn").style.display = "none";
  } else {
    document.getElementById("prevBtn").style.display = "inline";
  }
  if (n == (x.length - 1)) {
    document.getElementById("nextBtn").innerHTML = "Submit";
  } else {
    document.getElementById("nextBtn").innerHTML = "Next";
  }
  //... and run a function that will display the correct step indicator:
  fixStepIndicator(n)
}

function nextPrev(n) {
  // This function will figure out which tab to display
  var x = document.getElementsByClassName("formtab");
  // Cleanup Error Message
  document.getElementById("error").innerHTML = "";
  // Exit the function if any field in the current tab is invalid:
  if (n == 1 && !validateForm()) return false;
  // Hide the current tab:
  x[currentTab].style.display = "none";
  // Increase or decrease the current tab by 1:
  currentTab = currentTab + n;
  // if you have reached the end of the form...
  if (currentTab >= x.length) {
    // ... the form gets submitted:
    //document.getElementById("regForm").submit()
    currentTab = 0;
    submit_AAP();
  }
  // Otherwise, display the correct tab:
  showTab(currentTab);
}

function validateForm() {
  // This function deals with validation of the form fields
  var x, y, i, valid = true;
  x = document.getElementsByClassName("formtab");
  y = x[currentTab].getElementsByTagName("input");
  // A loop that checks every input field in the current tab:
  for (i = 0; i < y.length; i++) {
    // If a field is empty...
    document.getElementById("error").innerHTML += y[i].value + " ";
    if ( y[i].required && y[i].value == "" ) {
      // Print message that the fields are required
      // document.getElementById("error").innerHTML = "Fill in the required fields";
      // add an "invalid" class to the field:
      y[i].className += " invalid";
      // and set the current valid status to false
      valid = false;
    }
    // add all values to the formdata object
    formdata[y[i].id] =  y[i].value;
  }
  // If the valid status is true, mark the step as finished and valid:
  if (valid) {
    document.getElementsByClassName("step")[currentTab].className += " finish";
  }
  document.getElementById("cloudtype").innerHTML = "Enter Configuration Details for " + document.getElementById('type').value;
  // make cloud fields visible
  if ( document.getElementById('type').value == "azure") {
    document.getElementById('azure_cli_id').required = true;
    document.getElementById('azure_cli_id').className.replace( /(?:^|\s)hideme(?!\S)/ , '' );
    document.getElementById('azure_cli_secret').required = true;
    document.getElementById('azure_cli_secret').className.replace( /(?:^|\s)hideme(?!\S)/ , '' );
    document.getElementById('azure_tenant').required = true;
    document.getElementById('azure_tenant').className.replace( /(?:^|\s)hideme(?!\S)/ , '' );
    document.getElementById('azure_subscription').required = true;
    document.getElementById('azure_subscription').className.replace( /(?:^|\s)hideme(?!\S)/ , '' );
    document.getElementById('azure_location').required = true;
    document.getElementById('azure_location').className.replace( /(?:^|\s)hideme(?!\S)/ , '' );
    document.getElementById('azure_resource_group').className.replace( /(?:^|\s)hideme(?!\S)/ , '' );
  } else {
    document.getElementById('azure_cli_id').required = false;
    document.getElementById('azure_cli_id').className += " hideme";
    document.getElementById('azure_cli_secret').required = false;
    document.getElementById('azure_cli_secret').className += " hideme";
    document.getElementById('azure_tenant').required = false;
    document.getElementById('azure_tenant').className += " hideme";
    document.getElementById('azure_subscription').required = false;
    document.getElementById('azure_subscription').className += " hideme";
    document.getElementById('azure_location').required = false;
    document.getElementById('azure_location').className += " hideme";
    document.getElementById('azure_resource_group').className += " hideme";
  }
  // if private automation hub is enabled make other variables required
  if ( document.getElementById('controller_ah_enable').checked == true ) {
    document.getElementById('rhsm_ah_offline_token').required = true;
    document.getElementById('automation_hub_server_url').required = true;
  } else {
    document.getElementById('rhsm_ah_offline_token').required = false;
    document.getElementById('automation_hub_server_url').required = false;
  }
  return valid; // return the valid status
}

function fixStepIndicator(n) {
  // This function removes the "active" class of all steps...
  var i, x = document.getElementsByClassName("step");
  for (i = 0; i < x.length; i++) {
    x[i].className = x[i].className.replace(" active", "");
  }
  //... and adds the "active" class on the current step:
  x[n].className += " active";
}

function submit_AAP() {
  // Maybe apiURL und/oder apiKey als parameter?
  // Define the API URL
  const apiKey = formdata.token
  // const apiUrl = 'https://tower.redhat-demo.de/api/v2/job_templates/170/launch/'; // Create demo
  const apiUrl = 'https://tower.redhat-demo.de/api/v2/job_templates/185/launch/'; // Debug only
  const data = {
    "extra_vars": formdata;
  };

  alert(formdata.token)
  // disable cert check
  process.env["NODE_TLS_REJECT_UNAUTHORIZED"] = 0;

  const requestOptions = {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  };

  fetch(apiUrl, requestOptions)
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      alert(response.json());
    })
    // Use alert instead
    .then(data => {
      alert(data);
    })
    .catch(error => {
      alert(error);
    });
}