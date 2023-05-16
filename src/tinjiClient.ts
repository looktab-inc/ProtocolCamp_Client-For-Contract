import { AnchorProvider, Program } from "@project-serum/anchor";
import {
  withdrawForExpired,
  withdrawForVerified,
} from "./contract/instructions";

export class TinjiContract {
  readonly provider: AnchorProvider;
  readonly program: Program;

  constructor(provider: AnchorProvider, program: Program) {
    this.provider = provider;
    this.program = program;
  }

  initialize() {}

  depositForNFT() {}

  withdrawForBurned() {}

  withdrawForExpired() {}

  withdrawForVerified() {}
}
