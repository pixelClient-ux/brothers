"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";

import { MoreVertical, Pencil, RotateCwIcon, Trash2 } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import Image from "next/image";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { PaginationBar } from "@/components/PaginationBar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import EditMemberCard, { MemberEditType } from "@/components/EditMemberCard";
import DeleteMember from "@/components/DeleteMember";
import RenewMembership, {
  MembershipRenewProps,
} from "@/components/RenewMember";
import { useSearchParams } from "next/navigation";
import { MemberType } from "@/lib/memeberType";
interface deleteProps {
  id: string;
  name: string;
}

interface MemberListProps {
  data: MemberType[];
  total: number;
}

export default function MemberList({ data, total }: MemberListProps) {
  const searchParams = useSearchParams();
  const currentPage = searchParams.get("page") || 1;
  const [selectedMembers, setSelectedMembers] = useState<string[]>([]);
  const [allSelected, setAllSelected] = useState(false);
  const [selectedMember, setSelectedMember] = useState<MemberEditType | null>(
    null,
  );
  const [renewOpen, setRenewOpen] = useState(false);
  const [renewMember, setRenewMember] = useState<MembershipRenewProps | null>(
    null,
  );
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<string>("");
  const [name, setName] = useState("");

  const toggleAll = () => {
    if (allSelected) {
      setSelectedMembers([]);
    } else {
      setSelectedMembers(data.map((member) => member.phone));
    }
    setAllSelected(!allSelected);
  };

  const toggleMember = (phone: string) => {
    if (selectedMembers.includes(phone)) {
      setSelectedMembers(selectedMembers.filter((p) => p !== phone));
    } else {
      setSelectedMembers([...selectedMembers, phone]);
    }
  };

  function handleEditAction(member: MemberType) {
    const data: MemberEditType = {
      memberId: member._id,
      fullName: member.fullName,
      phone: member.phone,
      gender: member.gender,
      avatar: member.avatar,
      payments: member.payments.map((p) => ({
        amount: p.amount,
        date: new Date(p.date),

        method: p.method as "cash" | "cbe" | "tele-birr" | "transfer",
      })),
      durationMonths: member.membership?.durationMonths?.toString(),
    };

    setSelectedMember({ ...data });
    setEditOpen(true);
  }

  function handleRenewMember(member: MemberType) {
    const data = {
      id: member._id,
      fullName: member.fullName,
      avatar: member.avatar,
      phone: member.phone,
      status: member.membership?.status === "active" ? "Active" : "Expired",
      membershipPeriod: member.membership?.durationMonths?.toString() || "0",
    };

    setRenewMember(data);
    setRenewOpen(true);
  }

  function handleDeleteClick({ id, name }: deleteProps) {
    setName(name);
    setDeleteId(id);
    setDeleteOpen(true);
  }

  function handleConfirmDelete(id: string) {
    console.log("Deleting member with ID:", id);
    setDeleteOpen(false);
    setDeleteId("");
  }

  return (
    <>
      <div className="space-y-5">
        <Table className="mt-4">
          <TableHeader>
            <TableRow>
              <TableHead className="w-[50px]">
                <Checkbox checked={allSelected} onCheckedChange={toggleAll} />
              </TableHead>
              <TableHead className="text-white">Member</TableHead>
              <TableHead className="text-white">Phone</TableHead>
              <TableHead className="text-white">Gender</TableHead>
              <TableHead className="text-white">Status</TableHead>
              <TableHead className="text-right text-white">
                Amount (ETB)
              </TableHead>
              <TableHead className="text-right text-white">
                Payment Method
              </TableHead>
              <TableHead className="text-right text-white">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((member) => {
              const latestPayment = member.payments[member.payments.length - 1];
              return (
                <TableRow key={member.phone}>
                  <TableCell>
                    <Checkbox
                      checked={selectedMembers.includes(member.phone)}
                      onCheckedChange={() => toggleMember(member.phone)}
                    />
                  </TableCell>
                  <TableCell className="flex items-center gap-2 font-medium">
                    <Image
                      height={32}
                      width={32}
                      src={member.avatar || "/gym/profile.png"}
                      alt={member.fullName}
                      className="h-8 w-8 rounded-full object-cover"
                    />
                    {member.fullName}
                  </TableCell>

                  <TableCell>{member.phone}</TableCell>

                  <TableCell className="capitalize">{member.gender}</TableCell>

                  <TableCell>
                    {member.isActive ? (
                      <span className="text-green-500">Active</span>
                    ) : (
                      <span className="text-red-500">Expired</span>
                    )}
                  </TableCell>

                  <TableCell className="text-right">
                    {latestPayment?.amount != null
                      ? `${latestPayment.amount.toFixed(2)} ETB`
                      : "-"}
                  </TableCell>

                  <TableCell className="text-end uppercase">
                    {latestPayment?.method || "-"}
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="rounded-full hover:bg-gray-800"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <MoreVertical className="h-5 w-5 text-gray-300" />
                        </Button>
                      </DropdownMenuTrigger>

                      <DropdownMenuContent
                        align="end"
                        className="w-40 rounded-none border border-gray-700 bg-[#1C1F26] text-white"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuSeparator />

                        <DropdownMenuItem
                          className="cursor-pointer text-blue-400 hover:bg-blue-500/10"
                          onClick={() => handleEditAction(member)}
                        >
                          <Pencil className="mr-2 h-4 w-4" /> Edit
                        </DropdownMenuItem>

                        <DropdownMenuItem
                          className="cursor-pointer text-green-400 hover:bg-green-500/10"
                          onClick={() => handleRenewMember(member)}
                        >
                          <RotateCwIcon className="mr-2 h-4 w-4" /> Renew
                        </DropdownMenuItem>

                        <DropdownMenuItem
                          className="cursor-pointer text-red-400 hover:bg-red-500/10"
                          onClick={() =>
                            handleDeleteClick({
                              id: member._id,
                              name: member.fullName,
                            })
                          }
                        >
                          <Trash2 className="mr-2 h-4 w-4" /> Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
        <div>
          <PaginationBar currentPage={Number(currentPage)} totalPage={total} />
        </div>
      </div>

      <EditMemberCard
        open={editOpen}
        selectedMember={selectedMember}
        onOpenChange={() => setEditOpen(false)}
      />
      <DeleteMember
        open={deleteOpen}
        onDelete={() => handleConfirmDelete(deleteId)}
        onOpenChange={setDeleteOpen}
        id={deleteId}
        name={name}
      />
      <RenewMembership
        open={renewOpen}
        onOpenChange={setRenewOpen}
        member={renewMember}
      />
    </>
  );
}
