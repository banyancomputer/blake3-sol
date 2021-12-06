// SPDX-License-Identifier: GPL-3.0-or-later
pragma solidity ^0.8.6;

import "ds-test/test.sol";

import "./Blake3Sol.sol";

contract Blake3SolTest is DSTest {
    Blake3Sol sol;

    function setUp() public {
        sol = new Blake3Sol();
    }

    function test_hash() public {
        Hasher memory hasher = sol.new_hasher();

        Hasher memory hasher1 = sol.update_hasher(hasher, unicode"hellohello?");
        //assertEq(bytes32(hasher1.chunk_state.block_bytes), bytes32("oye"));

        bytes memory output = sol.finalize(hasher1);
        assertEq(bytes32(output),
                 0x10e6acb2cfcc4bb07588ad5b8e85f6a13f19e24f3302826effd93ce1ebbece6e);
    }

    function testFail_basic_sanity() public {
        assertTrue(false);
    }

    function test_basic_sanity() public {
        assertTrue(true);
    }
}
