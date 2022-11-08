---
title: "Configuring a Hyper-V Cluster"
date: 2015-07-04
slug: "2015-07-04-Configuring_a_Hyper-V_Cluster"
summary: "A step by step guide to configuring a basic Hyper-V Cluster on Windows Server 2012."
aliases:
  - "/2015-07-04-Configuring_a_Hyper-V_Cluster"
---

Hyper-V can be a particularly useful tool for consolidating computing resources. However, while consolidating machines into VMs can lower your hardware overhead costs, this introduces a single failure point for all your machines. If the Hyper-V server goes down, all your VMs will go down as well.

To overcome this issue, we can use Hyper-V's Failover and Load-balancing tools to build a Hyper-V cluster. These tools will provide failover for our machines so that, in the event of a critical failure on one of our Hyper-V nodes, the VMs running on that node will come back up on another node within seconds.

## Install OS

Begin by installing Windows Server 2012 R2 Datacenter on each of your nodes.

>If you are not planning on creating more than two Server 2012 Standard virtual machines, you can use Server 2012 Standard edition. However, if you need more Server 2012 Standard instances or if you need Server 2012 Datacenter instances, you will need to use Server 2012 Datacenter for your cluster nodes.

> This is because of the way Microsoft handles their server licenses [(More details)](http://www.altaro.com/hyper-v/virtual-machine-licensing-hyper-v/).

We don't need anything fancy here. Just install the OS normally and apply all updates.

## Network Overview

At a minimum, we need three separate networks: Data, Heartbeat, and iSCSI. The Data network will handle client connections and Internet connectivity. The Heartbeat network is an internal network exclusive to the cluster used for Live Migrations of virtual machines and cluster communications between nodes. The iSCSI network connects each of our nodes to our remote storage device.

>For the purposes of this guide, the remote storage will be located on a [NimbleStorage](http://www.nimblestorage.com/products-technology/products-specs/) SAN. Nimble recommends using Multipath I/O instead of network teaming for their iSCSI connections so that is what this guide will be doing. Check with your remote storage manufacturer and use their recommended best practices.

## Configure Network Connections

For this example, each of our cluster nodes has six Network Interface Cards (NICs) to provide redundancy for each network connection. We are going to use the NIC Teaming manager to manage our Load Balancing and Failover (LBFO) for
our duplicate NICs.

> The NIC Teaming manager can be opened by running *lbfoadmin* from the Start menu or by clicking the link next to NIC Teaming in *Server Manager > Local Server*.

Lets team our Data and Heartbeat connections. Our iSCSI connections will use Multipath I/O instead. [Instructions NIC teaming can be found here.](/2015/07/06/Load_Balancing_and_Failover_on_Server_2012/)

>The six NICs on my servers are in three pairs of two NICs each. To increase redundancy, I split my teams across the pairs so if any one pair were to go down, the other two would be able to handle the traffic until the first pair
could be replaced.

Now that our teams have been created, we need to configure the addresses of each connection. The following table shows an example configuration. Note that the Data, Heartbeat, and iSCSI networks are on separate subnets. Modify this as
necessary for your own network environment.

|           | NICs | Node1        | Node2        | Node3        | Subnet |
| --------- | ---- | ------------ | ------------ | ------------ | ------ |
| Data      | 1, 6 | 192.168.0.11 | 192.168.0.12 | 192.168.0.13 | /24    |
| Heartbeat | 2, 3 | 192.168.1.11 | 192.168.1.12 | 192.168.1.13 | /24    |
| iSCSI     | 4    | 192.168.2.11 | 192.168.2.12 | 192.168.2.13 | /24    |
| iSCSI     | 5    | 192.168.2.21 | 192.168.2.22 | 192.168.2.23 | /24    |

## Miscellaneous

Enable Remote Desktop connections to each of your nodes so we can manage them more easily later. We also need to add each node to our domain. If your remote storage solution uses Multipath I/O, install that now using this [PowerShell command](https://technet.microsoft.com/en-us/library/hh852172.aspx):

```powershell
Enable-WindowsOptionalFeature –Online –FeatureName MultiPathIO
```

>If you are using a NimbleStorage SAN, you should install their Nimble Connection utility now. Be sure to select the deselected option when prompted for components to install.

>I don't think the nodes _must_ be members of a domain but it does make several steps in the install simpler.

## Install Hyper-V
To install the Hyper-V service, run the following [PowerShell command](https://technet.microsoft.com/en-us/library/jj205467%28v=wps.630%29.aspx) on each node:

```powershell
Install-WindowsFeature –Name Hyper-V -IncludeManagementTools -Restart
```

> This command will install the Hyper-V service with its management tools and then restart the server.

## Configure Virtual Switch

We need to create our Hyper-V Virtual Switches. For a smooth cluster installation, make sure each of these switches is identical on each node. A way to do this without much hassle is to run the same [PowerShell commands](https://technet.microsoft.com/en-us/library/hh848455%28v=wps.630%29.aspx) on each node instead of manually configuring each switch. Run the following command on each node. If you are accessing your node via RDP your connection will be interrupted for a few seconds.

```powershell
New-VMSwitch “Data” –NetAdapterName “Data” –AllowManagementOS:$true
```

>This command will create a new virtual switch named Data that is connected to the network adapter on your server node named Data. It will create a new virtual NIC on your node called vData that your local node will use since
the physical NIC is now tied directly to the virtual switch.

## Install Failover Clustering

We are nearly ready to cluster our node servers! On each node, run the following [PowerShell command](https://technet.microsoft.com/en-us/library/jj205467%28v=wps.630%29.aspx) to install the Failover Clustering service with its management tools:

```powershell
Install-WindowsFeature –Name Failover-Clustering –IncludeManagementTools
```

Before we actually cluster our nodes, let's test our configuration. Run the following [PowerShell command](https://technet.microsoft.com/en-us/library/ee461026.aspx) and check the report for any failures.

```powershell
Test-Cluster –Node Node1,Node2,Node3 -ReportName "C:\TestClusterReport"
```

>You are likely to get warnings concerning your cluster's storage. This is fine. We will configure the cluster's shared storage soon.

After reviewing the report and addressing any problems, we are ready to cluster our nodes! Run the following [PowerShell command](https://technet.microsoft.com/en-us/library/ee460973.aspx) to create the cluster:

```powershell
New-Cluster –Name Cluster1 –Node Node1,Node2,Node3 –StaticAddress 192.168.0.10
```

## Configure Cluster Shared Volumes

At this point, you should refer to your remote storage manufacturer's best practice documentation for Hyper-V to configure your Cluster Shared Volumes (CSV).

>I will describe the steps necessary for a NimbleStorage SAN. If you are using a different remote storage system, you can skip most of this section and refer to your manufacturer's documentation instead.

>I will describe the steps necessary to connect to an existing volume but not how to create that volume on the SAN. Please refer to [their documentation](https://infosight.nimblestorage.com/InfoSight/login) instead.

On each node, open the Nimble Connection Manager and exclude all addresses except the iSCSI addresses. Make sure each node's Initiator Name is added to the SAN's initiator group. Enter your Nimble's Discovery IP and switch to the Nimble Volumes tab. Select the desired volume and click connect.

On only one of your nodes, open Disk Management and bring the new disk online. Initialize the disk and format with NTFS. You do not need to select a drive letter. In the Failover Cluster Manager, right click on Disks and select Add Disk. Select the available disks you want to add to the cluster's shared storage and click OK. Finally, under the disks item in the Failover Cluster Manager, right click on the volume(s) you just added and select Add to Cluster Shared Volume.

>Your new Cluster Shared Volume is now available on each server at "C:\\clustershared\\Volume01\\".

>It is recommended to edit the properties of your Cluster Shared Volumes to change their names from Volume01, Volume02, etc to match the names of the volumes on your SAN.

>For detailed information about Cluster Shared Volumes, check out this [MSDN article](http://blogs.msdn.com/b/clustering/archive/2013/12/02/10473247.aspx).

## Ready for Roles

We are done installing and configuring our Hyper-V cluster! At this point, we are free to add VMs to the cluster as roles.
