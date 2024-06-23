use starknet::ContractAddress;

#[starknet::interface]
trait IERC20<TContractState> {
    fn transfer(ref self: TContractState, recipient: ContractAddress, amount: u256) -> bool;
    fn transfer_from(ref self: TContractState, sender: ContractAddress, recipient: ContractAddress, amount: u256) -> bool;
    fn balance_of(self: @TContractState, account: ContractAddress) -> u256;
}

#[starknet::interface]
trait IERC721<TContractState> {
    fn balance_of(self: @TContractState, account: ContractAddress) -> u256;
    fn owner_of(self: @TContractState, token_id: u256) -> ContractAddress;
}

#[starknet::interface]
trait ISwapERC20<TContractState> {
    fn begin(
        ref self: TContractState,
        initiator_erc20: ContractAddress,
        initiator_amount: u256,
        counter_party_erc20: ContractAddress,
        counter_party_amount: u256,
        gated_account: ContractAddress,
        in_collection: Option<ContractAddress>,
        min_balance: Option<(ContractAddress, u256)>,
        token_id: Option<(ContractAddress, u256)>
    ) -> u32;
    fn cancel(ref self: TContractState, id: u32);
    fn complete(ref self: TContractState, id: u32);
    fn find_instance(self: @TContractState, id: u32) -> Instance;
}

#[derive(Drop, Serde, starknet::Store, Copy)]
struct GatingCriteria {
    gated_account: ContractAddress,
    in_collection: Option<ContractAddress>,
    min_balance: Option<(ContractAddress, u256)>,
    token_id: Option<(ContractAddress, u256)>,
}

#[derive(Drop, Serde, starknet::Store, Copy)]
struct Instance {
    id: u32,
    initiator: ContractAddress,
    initiator_erc20: ContractAddress,
    initiator_amount: u256,
    counter_party_erc20: ContractAddress,
    counter_party_amount: u256,
    state: u8,
    gating: GatingCriteria,
}

#[starknet::contract]
mod LenSwapERC20 {
    use super::{ContractAddress, Instance, IERC20, IERC721, ISwapERC20, GatingCriteria};
    use starknet::get_caller_address;
    use super::IERC20DispatcherTrait;
    use super::IERC20Dispatcher;
    use super::IERC721DispatcherTrait;
    use super::IERC721Dispatcher;

    const BEGUN: u8 = 0;
    const FINISHED: u8 = 1;
    const CANCELLED: u8 = 2;

    #[event]
    #[derive(Drop, starknet::Event)]
    enum Event {
        Begun: Begun,
        Cancelled: Cancelled,
        Finished: Finished,
    }

    #[derive(Drop, starknet::Event)]
    struct Begun {
        #[key]
        id: u32,
        initiator: ContractAddress,
    }

    #[derive(Drop, starknet::Event)]
    struct Cancelled {
        #[key]
        id: u32,
    }

    #[derive(Drop, starknet::Event)]
    struct Finished {
        #[key]
        id: u32,
    }

    #[storage]
    struct Storage {
        instance_id: u32,
        instances: LegacyMap<u32, Instance>,
    }

    #[constructor]
    fn constructor(ref self: ContractState) {
        self.instance_id.write(0);
    }

    #[abi(embed_v0)]
    impl SwapERC20Impl of ISwapERC20<ContractState> {
        fn begin(
            ref self: ContractState,
            initiator_erc20: ContractAddress,
            initiator_amount: u256,
            counter_party_erc20: ContractAddress,
            counter_party_amount: u256,
            gated_account: ContractAddress,
            in_collection: Option<ContractAddress>,
            min_balance: Option<(ContractAddress, u256)>,
            token_id: Option<(ContractAddress, u256)>
        ) -> u32 {
            assert(initiator_amount > 0, 'Invalid initiator amount');
            assert(counter_party_amount > 0, 'Invalid counter party amount');

            let caller = get_caller_address();
            let erc20 = IERC20Dispatcher { contract_address: initiator_erc20 };
            erc20.transfer_from(caller, starknet::get_contract_address(), initiator_amount);

            let new_id = self.instance_id.read() + 1;
            self.instance_id.write(new_id);

            let gating = GatingCriteria {
                gated_account,
                in_collection,
                min_balance,
                token_id,
            };

            let new_instance = Instance {
                id: new_id,
                initiator: caller,
                initiator_erc20: initiator_erc20,
                initiator_amount: initiator_amount,
                counter_party_erc20: counter_party_erc20,
                counter_party_amount: counter_party_amount,
                state: BEGUN,
                gating,
            };
            self.instances.write(new_id, new_instance);

            self.emit(Event::Begun(Begun { id: new_id, initiator: caller }));
            new_id
        }

        fn cancel(ref self: ContractState, id: u32) {
            let mut instance = self.instances.read(id);
            let caller = get_caller_address();
            assert(instance.initiator == caller, 'Unauthorized');
            assert(instance.state == BEGUN, 'Invalid state');

            instance.state = CANCELLED;
            self.instances.write(id, instance);

            let erc20 = IERC20Dispatcher { contract_address: instance.initiator_erc20 };
            erc20.transfer(instance.initiator, instance.initiator_amount);

            self.emit(Event::Cancelled(Cancelled { id: id }));
        }

        fn complete(ref self: ContractState, id: u32) {
            let mut instance = self.instances.read(id);
            let caller = get_caller_address();
            assert(instance.state == BEGUN, 'Invalid state');

            // Check gated account
            let gated_account = instance.gating.gated_account;
            if gated_account != starknet::contract_address_const::<0>() {
                assert(caller == gated_account, 'Gated: unauthorized account');
            }

            // Check collection membership
            if let Option::Some(collection_address) = instance.gating.in_collection {
                let erc721 = IERC721Dispatcher { contract_address: collection_address };
                assert(erc721.balance_of(caller) > 0_u256, 'Not in collection');
            }

            // Check minimum balance
            if let Option::Some((token, min_amount)) = instance.gating.min_balance {
                let erc20 = IERC20Dispatcher { contract_address: token };
                let balance = erc20.balance_of(caller);
                assert(balance >= min_amount, 'Insufficient token balance');
            }

            // Check token ID ownership
            if let Option::Some((collection_address, required_token_id)) = instance.gating.token_id {
                let erc721 = IERC721Dispatcher { contract_address: collection_address };
                assert(erc721.owner_of(required_token_id) == caller, 'Does not own required token');
            }

            instance.state = FINISHED;
            self.instances.write(id, instance);

            let counter_party_erc20 = IERC20Dispatcher { contract_address: instance.counter_party_erc20 };
            counter_party_erc20.transfer_from(caller, instance.initiator, instance.counter_party_amount);

            let initiator_erc20 = IERC20Dispatcher { contract_address: instance.initiator_erc20 };
            initiator_erc20.transfer(caller, instance.initiator_amount);

            self.emit(Event::Finished(Finished { id: id }));
        }

        fn find_instance(self: @ContractState, id: u32) -> Instance {
            self.instances.read(id)
        }
    }
}