"use client";

import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { MoreVertical, Pencil, RotateCw, Trash2 } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import Image from "next/image";
import {
  Table,
  TableBody,
  TableCell,
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

import EditMemberCard from "@/components/EditMemberCard";
import DeleteMember from "@/components/DeleteMember";
import RenewMembership, {
  MembershipRenewProps,
} from "@/components/RenewMember";

import { MemberType } from "@/lib/memeberType";
import { useSearchParams } from "next/navigation";

interface MemberListProps {
  data: MemberType[];
  total: number;
}

export default function MemberList({ data, total }: MemberListProps) {
  const [selectedMembers, setSelectedMembers] = useState<string[]>([]);
  const [allSelected, setAllSelected] = useState(false);
  const [selectedMember, setSelectedMember] = useState<MemberType | null>(null);
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<string>("");
  const [deleteName, setDeleteName] = useState<string>("");
  const [renewOpen, setRenewOpen] = useState(false);
  const [renewMember, setRenewMember] = useState<MembershipRenewProps | null>(
    null,
  );
  const searchParams = useSearchParams();

  const currentPage = searchParams.get("page") || 1;

  const toggleAll = () => {
    if (allSelected) setSelectedMembers([]);
    else setSelectedMembers(data.map((m) => m._id));
    setAllSelected(!allSelected);
  };

  const toggleMember = (id: string) => {
    if (selectedMembers.includes(id)) {
      setSelectedMembers(selectedMembers.filter((i) => i !== id));
    } else {
      setSelectedMembers([...selectedMembers, id]);
    }
  };

  const handleEdit = (member: MemberType) => {
    setSelectedMember(member);
    setEditOpen(true);
  };

  const handleDelete = (member: MemberType) => {
    setDeleteId(member._id);
    setDeleteName(member.fullName);
    setDeleteOpen(true);
  };

  const handleRenew = (member: MemberType) => {
    setRenewMember({
      id: member._id,
      fullName: member.fullName,
      avatar: member.avatar,
      phone: member.phone,
      status: member.membership?.status === "active" ? "Active" : "Expired",
      membershipPeriod: member.membership?.durationMonths?.toString() || "0",
    });
    setRenewOpen(true);
  };

  // Memoized to avoid unnecessary recalculations
  const membersWithLastPayment = useMemo(() => {
    return data.map((m) => {
      const latestPayment = m.payments[m.payments.length - 1];
      return {
        ...m,
        latestPayment,
        membershipStatus:
          m.membership?.status === "active" ? "Active" : "Expired",
        daysLeft: m.daysLeft ?? 0,
      };
    });
  }, [data]);

  return (
    <>
      <div className="space-y-5">
        <Table className="mt-4">
          <TableHeader>
            <TableRow>
              <TableCell className="w-[50px]">
                <Checkbox checked={allSelected} onCheckedChange={toggleAll} />
              </TableCell>
              <TableCell>Member</TableCell>
              <TableCell>Phone</TableCell>
              <TableCell>Gender</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Membership Left</TableCell>
              <TableCell className="text-right">Amount (ETB)</TableCell>
              <TableCell className="text-right">Payment Method</TableCell>
              <TableCell className="text-right">Actions</TableCell>
            </TableRow>
          </TableHeader>
          <TableBody>
            {membersWithLastPayment.map((member) => {
              const isActive = member.membershipStatus === "Active";

              return (
                <TableRow
                  key={member._id}
                  className={`transition-colors duration-200 ${
                    isActive
                      ? "bg-gray-900 hover:bg-gray-800"
                      : "bg-red-950 hover:bg-red-900"
                  }`}
                >
                  <TableCell>
                    <Checkbox
                      checked={selectedMembers.includes(member._id)}
                      onCheckedChange={() => toggleMember(member._id)}
                    />
                  </TableCell>

                  <TableCell className="flex items-center gap-2 font-medium">
                    <Image
                      height={32}
                      width={32}
                      src={member.avatar || "/gym/profile.png"}
                      alt={member.fullName}
                      className="h-8 w-8 rounded-full border-2 border-gray-600 object-cover"
                    />
                    {member.fullName}
                  </TableCell>

                  <TableCell>{member.phone}</TableCell>

                  <TableCell className="capitalize">{member.gender}</TableCell>

                  {/* Membership Status with Badge */}
                  <TableCell>
                    {member.membership?.status === "active" ? (
                      <span className="font-semibold text-green-500">
                        Active
                      </span>
                    ) : (
                      <span className="font-semibold text-red-500">
                        Expired
                      </span>
                    )}
                  </TableCell>
                  <TableCell className="text-center">
                    <span
                      className={`rounded-full px-4 py-1 text-sm ${
                        isActive
                          ? "bg-green-800 text-white"
                          : "bg-red-800 text-white"
                      }`}
                    >
                      {member.daysLeft} days
                    </span>
                  </TableCell>

                  <TableCell className="text-right font-medium">
                    {member.latestPayment?.amount?.toFixed(2) || "-"} ETB
                  </TableCell>

                  <TableCell className="text-right font-medium uppercase">
                    {member.latestPayment?.method || "-"}
                  </TableCell>

                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreVertical className="h-5 w-5" />
                        </Button>
                      </DropdownMenuTrigger>

                      <DropdownMenuContent
                        align="end"
                        className="w-44 rounded-md border border-gray-700 bg-gray-800 text-white"
                      >
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          onClick={() => handleEdit(member)}
                          className="text-blue-400 hover:bg-blue-600/20"
                        >
                          <Pencil className="mr-2 h-4 w-4" /> Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => handleRenew(member)}
                          className="text-green-400 hover:bg-green-600/20"
                        >
                          <RotateCw className="mr-2 h-4 w-4" /> Renew
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => handleDelete(member)}
                          className="text-red-400 hover:bg-red-600/20"
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

        <PaginationBar currentPage={Number(currentPage)} totalPage={total} />
      </div>

      {/* Modals */}
      <EditMemberCard
        open={editOpen}
        selectedMember={selectedMember}
        onOpenChange={setEditOpen}
      />
      <DeleteMember
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        id={deleteId}
        name={deleteName}
      />
      <RenewMembership
        open={renewOpen}
        onOpenChange={setRenewOpen}
        member={renewMember}
      />
    </>
  );
}
