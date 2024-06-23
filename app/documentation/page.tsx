import DocSection from "@/components/atoms/doc-section";
import GlassContainer from "@/components/molecules/glass-container";

const DocumentationHome = () => {
  return (
    <GlassContainer>
      <p className="pt-4 px-4 pb-2 font-semibold text-xl">Documentation</p>
      <div className="rounded-2xl bg-[#F8F8F7] p-4">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-6">
            Swap Intent Platform and SwapERC20 Contract Documentation
          </h1>

          <DocSection title="1. Introduction" open>
            <p>
              This document provides an overview of the Swap Intent Platform and
              the SwapERC20 smart contract. The platform facilitates
              peer-to-peer swaps of ERC20 tokens with advanced features such as
              gating mechanisms and flexible completion options.
            </p>
          </DocSection>

          <DocSection title="2. Swap Intent Platform">
            <DocSection title="2.1 Overview">
              <p>
                The Swap Intent Platform allows users to create, manage, and
                execute token swaps with various conditions and parameters.
              </p>
            </DocSection>

            <DocSection title="2.2 Key Components">
              <ul className="list-disc pl-6">
                <li>Swap Intent Structure</li>
                <li>UI Components: IntentHead and IntentBody</li>
                <li>Text Representation</li>
              </ul>
            </DocSection>

            <DocSection title="2.3 Features">
              <ul className="list-disc pl-6">
                <li>Create new swap intents</li>
                <li>View swap intents in a feed</li>
                <li>Confirm and execute swaps</li>
                <li>Optional gating conditions</li>
              </ul>
            </DocSection>

            <DocSection title="2.4 User Interface">
              <p>The platform includes the following main sections:</p>
              <ul className="list-disc pl-6">
                <li>Intents</li>
                <li>My Swaps</li>
                <li>Markets</li>
                <li>Docs</li>
              </ul>
            </DocSection>
          </DocSection>

          <DocSection title="3. SwapERC20 Smart Contract">
            <DocSection title="3.1 Overview">
              <p>
                The SwapERC20 contract is a Cairo smart contract designed for
                the Starknet platform. It implements the core functionality of
                the Swap Intent Platform.
              </p>
            </DocSection>

            <DocSection title="3.2 Key Features">
              <ul className="list-disc pl-6">
                <li>Initiate token swaps between two parties</li>
                <li>Cancel initiated swaps</li>
                <li>Complete swaps by transferring tokens between parties</li>
                <li>Query swap instances</li>
              </ul>
            </DocSection>

            <DocSection title="3.3 Contract Structure">
              <ul className="list-disc pl-6">
                <li>Interfaces: IERC20 and ISwapERC20</li>
                <li>Main Components: Instance struct and SwapERC20 module</li>
              </ul>
            </DocSection>

            <DocSection title="3.4 Key Functions">
              <ul className="list-disc pl-6">
                <li>begin: Initiates a new swap instance</li>
                <li>cancel: Cancels an existing swap instance</li>
                <li>complete: Completes a swap by transferring tokens</li>
                <li>
                  find_instance: Retrieves information about a specific swap
                  instance
                </li>
              </ul>
            </DocSection>

            <DocSection title="3.5 Events">
              <ul className="list-disc pl-6">
                <li>Begun: Emitted when a new swap is initiated</li>
                <li>Cancelled: Emitted when a swap is cancelled</li>
                <li>Finished: Emitted when a swap is completed</li>
              </ul>
            </DocSection>

            <DocSection title="3.6 Implementation Details">
              <ul className="list-disc pl-6">
                <li>
                  Uses Cairo&apos;s latest syntax and Starknet-specific attributes
                </li>
                <li>Implements proper error handling and access control</li>
                <li>
                  Utilizes the IERC20 interface for interacting with ERC20
                  tokens
                </li>
                <li>Handles ownership and copying issues specific to Cairo</li>
              </ul>
            </DocSection>

            <DocSection title="3.7 Gating Mechanisms">
              <p>
                The contract supports various gating mechanisms for swap
                completion:
              </p>
              <ul className="list-disc pl-6">
                <li>Account-based restrictions</li>
                <li>NFT collection membership</li>
                <li>Token balance requirements</li>
                <li>Specific NFT ownership</li>
              </ul>
            </DocSection>
          </DocSection>

          <DocSection title="4. Development and Deployment">
            <DocSection title="4.1 Best Practices">
              <ul className="list-disc pl-6">
                <li>
                  Proper use of Cairo&apos;s trait system for defining interfaces
                </li>
                <li>
                  Correct implementation of external contract calls using
                  dispatchers
                </li>
                <li>Handling of ownership and copying in Cairo</li>
                <li>
                  Proper event emission for important contract state changes
                </li>
                <li>
                  Use of assertions for input validation and access control
                </li>
              </ul>
            </DocSection>

            <DocSection title="4.2 Testing">
              <p>Thorough testing should include:</p>
              <ul className="list-disc pl-6">
                <li>
                  Successful swap initiation, cancellation, and completion
                </li>
                <li>
                  Handling of invalid inputs and unauthorized access attempts
                </li>
                <li>Edge cases in token amounts and address handling</li>
                <li>Interaction with various ERC20 token implementations</li>
              </ul>
            </DocSection>

            <DocSection title="4.3 Deployment Considerations">
              <ul className="list-disc pl-6">
                <li>
                  Ensure all necessary ERC20 token contracts are properly
                  deployed and accessible
                </li>
                <li>Set initial state variables correctly</li>
                <li>Implement proper permissions for contract management</li>
              </ul>
            </DocSection>

            <DocSection title="4.4 Security Considerations">
              <ul className="list-disc pl-6">
                <li>Implement proper access control for critical functions</li>
                <li>
                  Check for reentrancy and other common smart contract
                  vulnerabilities
                </li>
                <li>
                  Consider the implications of token transfers failing in the
                  `complete` function
                </li>
              </ul>
            </DocSection>
          </DocSection>

          <DocSection title="5. Future Improvements">
            <ul className="list-disc pl-6">
              <li>Implement more sophisticated approval mechanisms</li>
              <li>Add additional security checks and fail-safes</li>
              <li>Optimize gas usage where possible</li>
              <li>Implement batch operations for multiple swaps</li>
            </ul>
          </DocSection>

          <DocSection title="6. Conclusion">
            <p>
              The Swap Intent Platform and SwapERC20 contract provide a flexible
              and secure solution for peer-to-peer token swaps on the Starknet
              platform. By following the documentation and best practices
              outlined in this document, developers can effectively integrate
              and extend the functionality of the system.
            </p>
          </DocSection>
        </div>
      </div>
    </GlassContainer>
  );
};

export default DocumentationHome;
