# SAP Installation Automation Demos

[![License: Apache 2.0](https://img.shields.io/badge/License-Apache%202.0-blue.svg)](LICENSE)
[![Documentation](https://img.shields.io/badge/docs-github--pages-blue)](https://redhat-sap.github.io/demo.sap_install)

This repository contains comprehensive demonstration playbooks showcasing the [`community.sap_install`](https://galaxy.ansible.com/community/sap_install) Ansible collection for automated SAP system deployments. These examples demonstrate enterprise-grade SAP automation using [AWX](https://github.com/ansible/awx) or [Red Hat Ansible Automation Platform](https://www.ansible.com/products/controller).

### Maintenance and execution environments

- **Tested path**: The playbooks under [`generic/`](generic/) are the maintained, functionally tested baseline for SAP installation demos.
- **Needs validation**: The [Azure](#azure), [VMware](#vmware), [Google Cloud](#google-cloud-platform), and [PowerVC](#powervc-ibm-power-systems) directories are **not** regularly tested against current hypervisor/cloud APIs, collections, and OS images. Expect breakage and extra tuning before they work in your environment.
- **Execution environments (AWX / AAP)**: Container images and build definitions for SAP automation live in the separate project **[sap-linuxlab/ansible.executionenvironment](https://github.com/sap-linuxlab/ansible.executionenvironment)**. This repo no longer ships an `awx-ee/` tree.

## 🚀 Quick Start

1. **Choose your platform** (recommended: start with [Generic](#generic-templates)): [Generic](#generic-templates) | [Azure](#azure) | [VMware](#vmware) | [Google Cloud](#google-cloud-platform) | [PowerVC](#powervc-ibm-power-systems)
2. **Deploy infrastructure**: Run the `01-server-provisioning-*.yml` playbook for your platform
3. **Configure systems**: Execute `02-basic-os-setup.yml` for OS preparation
4. **Install SAP**: Run the appropriate SAP installation playbooks
5. **Manage lifecycle**: Use tools and utilities for ongoing operations

📖 **[Complete Documentation](https://redhat-sap.github.io/demo.sap_install)**

## 🏗️ Architecture Overview

The automation follows a structured 4-phase approach:

```
Phase 1: Infrastructure → Phase 2: OS Setup → Phase 3: SAP Prep → Phase 4: SAP Install
     │                        │                    │                     │
     ├─ Server Provisioning   ├─ OS Configuration  ├─ HANA Prepare      ├─ HANA Install
     ├─ Network Setup         ├─ Package Updates   ├─ NetWeaver Prep    ├─ S/4HANA Install
     └─ Storage Configuration └─ Security Setup    └─ Clustering Setup  └─ Post-Config
```

## 🌟 Key Features

### ✅ **Multi-Platform Support**
- **Generic templates** ([`generic/`](generic/)): Platform-agnostic playbooks — **supported and tested** baseline
- **Azure**: Example ARM / cloud integration (not verified out of the box; see note above)
- **VMware vSphere**: Example vCenter automation (not verified out of the box; see note above)
- **Google Cloud Platform**: Example GCP automation (not verified out of the box; see note above)
- **PowerVC (IBM Power)**: Example PowerVC automation (not verified out of the box; see note above)

### ✅ **SAP Lifecycle Automation**
- **SAP HANA**: Single-node and clustered installations with System Replication
- **SAP S/4HANA**: Complete application layer deployment with NetWeaver
- **High Availability**: Pacemaker clustering with cloud-native fencing
- **Software Management**: Automated download and deployment from SAP Launchpad

### ✅ **Enterprise Integration**
- **AWX/AAP Integration**: Job templates and demos; execution environment images from [sap-linuxlab/ansible.execution-environment](https://github.com/sap-linuxlab/ansible.execution-environment)
- **Red Hat Satellite**: Automated subscription and repository management
- **Container Support**: Podman-based execution environments
- **CI/CD Ready**: Pre-commit hooks, linting, and quality gates

## 📁 Repository Structure

```
demo.sap_install/
├── azure/                      # Azure-specific playbooks and configs
├── vmware/                     # VMware vSphere automation
├── google/                     # Google Cloud Platform deployments
├── powervc/                    # IBM PowerVC for Power Systems
├── generic/                    # Platform-agnostic templates
├── docs/                       # GitHub Pages documentation
├── demo-setup/                 # AAP/AWX configuration examples
├── tools/                      # Utility scripts and helpers
├── vars/                       # Example variable configurations
└── misc/                       # Additional utilities
```

## 🔧 Platform-Specific Guides

### Generic templates

Recommended starting point: platform-agnostic playbooks under [`generic/`](generic/). These are the **maintained and tested** path (provision hosts yourself or use `01-server-provisioning.yml` as a template, then run OS and SAP steps):

```bash
ansible-playbook generic/02-basic-os-setup.yml
ansible-playbook generic/03-A-sap-hana-prepare.yml
ansible-playbook generic/03-B-sap-hana-install.yml
```

**Features**: Works with any inventory; minimal cloud coupling; aligns with current `community.sap_install` usage in this repo.

### Azure

> **Status**: Not regularly regression-tested. Modules, APIs, and variables may need updates before this works in your subscription.

Deploy SAP on Microsoft Azure with integrated load balancing and availability zones:

```bash
# 1. Provision Azure infrastructure
ansible-playbook azure/01-server-provisioning-azure.yml -e @vars/azure/my-config.yml

# 2. Configure operating system
ansible-playbook azure/02-basic-os-setup.yml

# 3. Install SAP HANA with clustering
ansible-playbook azure/03-CD-sap-hana-cluster.yml
```

**Features**: ARM templates, Azure Load Balancer, Availability Sets, Managed Disks

### VMware

> **Status**: Not regularly regression-tested. Validate against your vCenter version, VM templates, and storage/network layout.

Enterprise VMware vSphere deployment with full lifecycle management:

```bash
# Deploy complete SAP landscape on VMware
ansible-playbook vmware/01-server-provisioning-vmware.yml -e @vars/vmware/production.yml
ansible-playbook vmware/02-basic-os-setup.yml
ansible-playbook vmware/03-A-sap-hana-prepare.yml
ansible-playbook vmware/03-B-sap-hana-install.yml
```

**Features**: vCenter integration, DRS/HA clusters, Storage vMotion, Template management

### Google Cloud Platform

> **Status**: Not regularly regression-tested. Expect to adjust playbooks, credentials, and cloud resources for current GCP APIs and images.

Leverage Google Cloud managed services and storage buckets:

```bash
# GCP deployment with Cloud Storage integration
ansible-playbook google/01-server-provisioning-gcp.yml
ansible-playbook google/03-B-sap-hana-install-from-storage-bucket.yml
```

**Features**: Cloud Storage integration, Managed Instance Groups, Load Balancing

### PowerVC (IBM Power Systems)

> **Status**: Not regularly regression-tested. Validate against your PowerVC version, storage layout, and RHEL for SAP images.

Specialized deployment for IBM Power Systems with PowerVC:

```bash
# Power Systems deployment
ansible-playbook powervc/01-server-provisioning-power.yml
ansible-playbook powervc/02-basic-os-setup-storage.yml
ansible-playbook powervc/03-B-sap-hana-install.yml
```

**Features**: Power-specific optimizations, Storage management, AIX compatibility

## 📋 Prerequisites

### System Requirements
- **Ansible**: 2.14+ with `community.sap_install` collection
- **Python**: 3.8+ with cloud provider SDKs
- **SAP Software**: Access to SAP Launchpad or pre-downloaded media
- **Subscriptions**: Valid Red Hat and SAP licenses

### Cloud Provider Setup
- Configure authentication (Azure CLI, AWS CLI, gcloud, etc.)
- Ensure proper IAM permissions for resource creation
- Set up networking (VPCs, subnets, security groups)

### Installation
```bash
# Install the SAP installation collection (minimum for the generic playbooks)
ansible-galaxy collection install community.sap_install

# Python extras for cloud or special modules: align with your EE or see
# https://github.com/sap-linuxlab/ansible.execution-environment
```

## 🎯 Common Use Cases

### 1. **Development Environment**
Quick SAP HANA setup for development:
```bash
ansible-playbook generic/03-A-sap-hana-prepare.yml \
  -e sap_hana_install_sid=DEV \
  -e sap_hana_install_instance_number=00
```

### 2. **Production Cluster**
High-availability SAP deployment (example uses the tested `generic/` tree; Azure-specific cluster playbooks exist but are not regularly validated):
```bash
ansible-playbook generic/03-CD-sap-hana-cluster.yml \
  -e @vars/generic/vars.cluster-sbd.example
```

### 3. **S/4HANA Migration**
Complete application layer deployment (uses the tested `generic/` playbook; a `vmware/` variant exists but is not regularly validated):
```bash
ansible-playbook generic/04-B-S4-deployment.yml \
  -e sap_swpm_product_catalog_id="NW_ABAP_OneHost:S4HANA2023.CORE.HDB.ABAP"
```

## 🛠️ Execution Environments

SAP-focused **Ansible Execution Environments** (container images for AWX, AAP, and `ansible-navigator`) are maintained in **[sap-linuxlab/ansible.execution-environment](https://github.com/sap-linuxlab/ansible.execution-environment)**.

Use that repository to build or pull images, then reference them in AWX/AAP or locally, for example:

```bash
ansible-navigator run generic/02-basic-os-setup.yml \
  --execution-environment-image <your-sap-ee-image:tag>
```

Historical `awx-ee/` definitions were removed from this demo repository in favor of the centralized SAP LinuxLab project.

## 📚 Documentation & Examples

- 📖 **[Complete Documentation](https://redhat-sap.github.io/demo.sap_install)**: Comprehensive guides and tutorials
- 🔧 **[Variable Examples](vars/README.md)**: Configuration templates for all scenarios
- 🚀 **[AWX Integration](demo-setup/README.md)**: Job templates and workflow examples
- 🛠️ **[Tools & Utilities](tools/)**: Helper scripts for common tasks

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guidelines](CONTRIBUTING.md) for details.

### Development Setup
```bash
# Install development tools
pip install pre-commit ansible-lint yamllint

# Enable pre-commit hooks
pre-commit install

# Run quality checks
pre-commit run --all-files
```

## 📄 License

This project is licensed under the Apache License 2.0 - see the [LICENSE](LICENSE) file for details.

## 🆘 Support & Community

- **Issues**: [GitHub Issues](https://github.com/redhat-sap/demo.sap_install/issues)
- **Discussions**: [GitHub Discussions](https://github.com/redhat-sap/demo.sap_install/discussions)
- **SAP LinuxLab**: [Main Project Page](https://sap-linuxlab.github.io)
- **Red Hat Support**: For enterprise support, contact Red Hat Customer Success

---

**Made with ❤️ by the Red Hat SAP Team**
