### Made by rpmn0ise https://rpmn0ise.neocities.org/



NixOS Flakes Deployment Workflow: A Procedural Guide
====================================================

NixOS Flakes represent a shift toward a hermetic, reproducible, and composable system configuration. By moving away from mutable channels and environment-dependent paths, Flakes ensure that a configuration evaluated today will yield the exact same result in the future, regardless of the state of the external internet or the local system environment.

This guide details the procedural steps required to transition a standard NixOS installation to a Flake-based workflow.

1\. Core Concepts and Architecture
----------------------------------

### The Role of the Lockfile

In a traditional setup, system updates depend on the current state of the Nix channels. Flakes replace this with a dependency graph defined in a top-level file. The resulting versions are pinned in a JSON-formatted lockfile. This file ensures that every collaborator or secondary machine uses the identical revision of all inputs.

### Hermetic Evaluation

Flakes enforce "pure" evaluation. This means the build process cannot access environment variables or files outside the project directory unless they are explicitly tracked by the version control system.

2\. Prerequisites
-----------------

Before proceeding, ensure the following requirements are met:

*   **NixOS Version**: A functional NixOS installation (22.11 or later is recommended).
*   **Experimental Features**: The Nix command-line tool and Flakes feature must be enabled.
*   **Version Control**: Git must be installed, as Nix Flakes prioritize files tracked by Git.

### Enabling Flakes

To enable the necessary tools, modify the existing `/etc/nixos/configuration.nix` to include the experimental features. Add the following line to the configuration:

    nix.settings.experimental-features = [ "nix-command" "flakes" ];
    

Apply this change by running:

    sudo nixos-rebuild switch
    

3\. Structural Initialization
-----------------------------

The deployment workflow requires a centralized directory for all configuration logic. It is standard practice to move these files from the root-owned `/etc/nixos/` to a user-controlled directory for easier management with Git.

### Setup Commands

Create a configuration directory and initialize a Git repository:

    mkdir -p ~/nixos-config
    cd ~/nixos-config
    git init
    cp /etc/nixos/*.nix .
    

4\. Implementation: The Flake Entry Point
-----------------------------------------

The `flake.nix` file serves as the schema for your system. It defines where to pull packages from (Inputs) and what configurations to build (Outputs).

### Creating flake.nix

Create a file named `flake.nix` in your configuration directory with the following structure. Replace `your-hostname` with the actual hostname of your machine.

    {
      description = "NixOS Flake Configuration Guide";
    
      inputs = {
        nixpkgs.url = "github:nixos/nixpkgs/nixos-24.11";
      };
    
      outputs = { self, nixpkgs, ... }: {
        nixosConfigurations.your-hostname = nixpkgs.lib.nixosSystem {
          system = "x86_64-linux";
          modules = [
            ./configuration.nix
          ];
        };
      };
    }
    

5\. Deployment Workflow
-----------------------

The deployment process follows a strict sequence: staging changes, building the system, and committing the resulting lockfile.

### Step 1: Staging

Nix will ignore any file not tracked by Git. Even if a file exists, the build will fail unless it is added to the index.

    git add .
    

### Step 2: System Rebuild

The command to apply a flake configuration differs slightly from the legacy method. Use the path to the directory and specify the output name after a hash symbol.

    sudo nixos-rebuild switch --flake .#your-hostname
    

### Step 3: Managing Updates

To update the system dependencies (e.g., pulling the latest security patches from the specified Nixpkgs branch), update the lockfile and rebuild:

    nix flake update
    sudo nixos-rebuild switch --flake .#your-hostname
    

6\. Comparison of Workflows
---------------------------

Action

Legacy Workflow

Flake Workflow

**Updates**

`nix-channel --update`

`nix flake update`

**Rebuild**

`nixos-rebuild switch`

`nixos-rebuild switch --flake .`

**Pinning**

Manual NIX\_PATH overrides

Automatic via `flake.lock`

**Portability**

Requires manual channel sync

Fully portable via Git repo

7\. Limitations and Common Pitfalls
-----------------------------------

*   **The "Dirty" Tree**: If you have uncommitted changes, Nix may mark the build as "dirty." This is a metadata warning and usually does not prevent the build, but it highlights that the state is not fully reproducible until committed.
*   **Absolute Paths**: Hardcoded paths like `/home/user/config` will often fail in a flake build due to the purity requirement. Use relative paths within the flake directory.
*   **Hardware Changes**: Always ensure your `hardware-configuration.nix` (generated by the installer) is included in the flake modules, as it contains the critical file system UUIDs and kernel modules.

8\. Troubleshooting
-------------------

If the build fails with a "file not found" error despite the file being present in the directory, verify its status in Git:

    git status
    

If the file is listed as "Untracked," run `git add` to include it in the Nix evaluation environment.





### Made by rpmn0ise https://rpmn0ise.neocities.org/
