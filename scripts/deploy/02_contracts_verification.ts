import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";
import { waitFor } from "../txHelper";
import { CONTRACTS, CONFIGURATION } from "../constants";
import { NomicLabsHardhatPluginError } from "hardhat/plugins";

const delay = (ms: number | undefined) => new Promise(resolve => setTimeout(resolve, ms))

// TODO: Shouldn't run setup methods if the contracts weren't redeployed.
const func: DeployFunction = async (hre: HardhatRuntimeEnvironment) => {
    const { deployments, getNamedAccounts, ethers } = hre;
    const { deployer } = await getNamedAccounts();
    const signer = await ethers.provider.getSigner(deployer);

    console.log("Account balance:", ethers.utils.formatEther((await signer.getBalance()).toString()) + " ETH");

    const blake3Deployment = await deployments.get(CONTRACTS.blake3);
    
    const network = await ethers.provider.getNetwork();

    const deployerAddress =  signer.getAddress();
    
    if (network.chainId !== CONFIGURATION.hardhatChainId) {
        try {
            console.log("Sleepin' for 30 seconds to wait for the chain to be ready...");
            await delay(30e3); // 30 seconds delay to allow the network to be synced
            await hre.run("verify:verify", {
                address: blake3Deployment.address,
                constructorArguments: [],
            });
            console.log("Verified -- blake3 Contract");
        } catch (error) {
            if (error instanceof NomicLabsHardhatPluginError) {
                // specific error
                console.log("Error verifying -- blake3 Contract");
                console.log(error.message);
            } else {
                throw error; // let others bubble up
            }                      
        }
    }    
};

func.tags = ["verify"];
func.dependencies = [CONTRACTS.blake3];

export default func;
